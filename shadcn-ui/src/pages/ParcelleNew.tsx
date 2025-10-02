// src/pages/ParcelleNew.tsx
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, MapPin, Save } from 'lucide-react';

import { MapContainer, TileLayer, Marker, Circle, Polygon, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import * as turf from '@turf/turf';

// ------------------------------
// Types & Config
// ------------------------------
type ZoneClass = 'forest' | 'bare_soil' | 'crop' | 'water' | 'urban' | 'unknown';

type FeatureOverlay = {
  id: string;
  cls: ZoneClass;
  // chemins (anneaux) au format Leaflet [lat, lng]
  paths: Array<Array<{ lat: number; lng: number }>>;
  // GeoJSON d'origine pour la sauvegarde + surface
  feature: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
};

type JobStatus = 'queued' | 'running' | 'done' | 'failed';

const USE_MOCK = true; // ← passe à false quand ton backend est prêt

const classColors: Record<ZoneClass, string> = {
  forest: '#2e7d32',
  bare_soil: '#a1887f',
  crop: '#558b2f',
  water: '#1565c0',
  urban: '#6d4c41',
  unknown: '#9e9e9e'
};

const defaultCenter = { lat: 5.3364, lng: -4.0267 }; // Côte d’Ivoire

// Icône Leaflet par défaut (fix chemin assets)
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// ------------------------------
// Helpers Leaflet
// ------------------------------
function FitBounds({ polygons }: { polygons: Array<Array<{ lat: number; lng: number }>>[] }) {
  const map = useMap();
  React.useEffect(() => {
    if (!polygons?.length) return;
    const b = L.latLngBounds([]);
    polygons.forEach(rings =>
      rings.forEach(ring => ring.forEach(p => b.extend([p.lat, p.lng])))
    );
    if (b.isValid()) map.fitBounds(b, { padding: [32, 32] });
  }, [polygons, map]);
  return null;
}

function ClickToMoveCenter({ onMove }: { onMove: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMove(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

// ------------------------------
// Composant principal
// ------------------------------
const ParcelleNew: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  // -------- Form state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [culture, setCulture] = useState<'cacao' | 'hevea' | 'palmier'>('cacao');
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [densite, setDensite] = useState(100);

  const [lat, setLat] = useState(defaultCenter.lat);
  const [lon, setLon] = useState(defaultCenter.lng);

  const [generatedPolygon, setGeneratedPolygon] = useState<GeoJSON.Feature<GeoJSON.Polygon> | null>(null);
  const [calculatedArea, setCalculatedArea] = useState<number>(0);

  // -------- Carte / Algo
  const mapRef = useRef<L.Map | null>(null);
  const [radiusKm, setRadiusKm] = useState(1.0);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [overlays, setOverlays] = useState<FeatureOverlay[]>([]);

  const center = useMemo(() => ({ lat, lng: lon }), [lat, lon]);
  const onLoad = useCallback((map: L.Map) => (mapRef.current = map), []);
  const onUnmount = useCallback(() => { mapRef.current = null; }, []);

  // ------------------- ✅ SOLUTION 1 : Géoloc + recentrage
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Géolocalisation non supportée par votre navigateur.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const la = pos.coords.latitude;
        const lo = pos.coords.longitude;
        setLat(la);
        setLon(lo);

        // Recentrer la carte et zoomer
        if (mapRef.current) {
          mapRef.current.flyTo([la, lo], 17, { duration: 1 });
        }
      },
      (err) => {
        console.error(err);
        setError("Impossible d'obtenir votre position. Utilisez les coordonnées par défaut.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handlePolygonGenerated = (polygon: GeoJSON.Feature<GeoJSON.Polygon>, areaHa: number) => {
    setGeneratedPolygon(polygon);
    setCalculatedArea(areaHa);
  };

  // ------------------- API (mock + vrai)
  async function startJobAPI(_lat: number, _lon: number, _radiusKm: number): Promise<{ jobId: string }> {
    if (USE_MOCK) {
      await sleep(400);
      return { jobId: 'mock-job-1' };
    }
    const res = await fetch('/api/soil-segmentation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat: _lat, lng: _lon, radius_km: _radiusKm })
    });
    if (!res.ok) throw new Error('Lancement analyse impossible');
    return res.json();
  }

  async function pollStatusAPI(jobId: string): Promise<JobStatus> {
    if (USE_MOCK) {
      await sleep(800);
      setProgress((p) => Math.min(100, p + 25));
      return progress >= 100 ? 'done' : 'running';
    }
    const res = await fetch(`/api/soil-segmentation/${jobId}/status`);
    if (!res.ok) throw new Error('Erreur statut job');
    const data = await res.json();
    if (typeof data.progress === 'number') setProgress(data.progress);
    return data.status as JobStatus;
  }

  async function getResultAPI(jobId: string): Promise<GeoJSON.FeatureCollection> {
    if (USE_MOCK) {
      // 3 polygones carrés en GeoJSON autour du centre
      const mkSquare = (dxM: number, dyM: number, sizeM: number, cls: ZoneClass) => {
        const toDeg = (m: number) => m / 111_320;
        const dx = toDeg(dxM), dy = toDeg(dyM), d = toDeg(sizeM);
        const ring = [
          [lon + dx - d, lat + dy - d],
          [lon + dx + d, lat + dy - d],
          [lon + dx + d, lat + dy + d],
          [lon + dx - d, lat + dy + d],
          [lon + dx - d, lat + dy - d]
        ];
        return turf.polygon([ring], { class: cls });
      };
      await sleep(500);
      return turf.featureCollection([
        mkSquare(0, 0, 250, 'crop'),
        mkSquare(400, 200, 220, 'forest'),
        mkSquare(-350, -150, 200, 'bare_soil')
      ]) as GeoJSON.FeatureCollection;
    }
    const res = await fetch(`/api/soil-segmentation/${jobId}/result`);
    if (!res.ok) throw new Error('Résultat indisponible');
    return res.json();
  }

  // ------------------- Conversion GeoJSON → Overlays Leaflet
  function fcToOverlays(fc: GeoJSON.FeatureCollection): FeatureOverlay[] {
    const out: FeatureOverlay[] = [];
    for (const f of fc.features) {
      const cls = ((f.properties as any)?.class || 'unknown') as ZoneClass;
      if (!f.geometry) continue;

      const id = (f.id as string) || Math.random().toString(36).slice(2);

      if (f.geometry.type === 'Polygon') {
        const poly = f.geometry.coordinates.map(ring =>
          ring.map(([x, y]) => ({ lng: x, lat: y }))
        );
        out.push({ id, cls, paths: poly, feature: f as GeoJSON.Feature<GeoJSON.Polygon> });
      } else if (f.geometry.type === 'MultiPolygon') {
        const allRings: FeatureOverlay['paths'] = [];
        for (const poly of f.geometry.coordinates) {
          for (const ring of poly) {
            allRings.push(ring.map(([x, y]) => ({ lng: x, lat: y })));
          }
        }
        out.push({ id, cls, paths: allRings, feature: f as GeoJSON.Feature<GeoJSON.MultiPolygon> });
      }
    }
    return out;
  }

  // ------------------- Action : Analyser
  const runAnalysis = async () => {
    try {
      setError('');
      setOverlays([]);
      setProgress(0);
      setStatus('queued');

      const { jobId } = await startJobAPI(lat, lon, radiusKm);
      setStatus('running');

      let s: JobStatus = 'running';
      for (let i = 0; i < 30 && s !== 'done' && s !== 'failed'; i++) {
        await sleep(1000);
        s = await pollStatusAPI(jobId);
        setStatus(s);
      }
      if (s !== 'done') throw new Error("Analyse non terminée");

      const fc = await getResultAPI(jobId);
      const feats = fcToOverlays(fc);
      setOverlays(feats);

      // Fit bounds
      const map = mapRef.current;
      if (map && feats.length) {
        const b = L.latLngBounds([]);
        feats.forEach(f => f.paths.forEach(r => r.forEach(pt => b.extend([pt.lat, pt.lng]))));
        if (b.isValid()) map.fitBounds(b, { padding: [32, 32] });
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Erreur durant l’analyse.');
      setStatus('failed');
    }
  };

  // ------------------- Sélection d’un polygone (pour sauvegarde)
  const selectOverlay = (ov: FeatureOverlay) => {
    // Convertit MultiPolygon -> Polygon (1er anneau) pour l’enregistrement simple
    let poly: GeoJSON.Feature<GeoJSON.Polygon>;
    if (ov.feature.geometry.type === 'Polygon') {
      poly = ov.feature as GeoJSON.Feature<GeoJSON.Polygon>;
    } else {
      const first = (ov.feature.geometry.coordinates[0] || []) as number[][];
      poly = turf.polygon([first]) as GeoJSON.Feature<GeoJSON.Polygon>;
    }
    const areaHa = turf.area(poly) / 10_000;
    handlePolygonGenerated(poly, Number(areaHa.toFixed(4)));
  };

  // ------------------- Submit Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !generatedPolygon) return;

    setLoading(true);
    setError('');

    try {
      const parcelleData = {
        ownerUid: user.uid,
        name,
        culture,
        annee,
        densite,
        geomGeoJSON: generatedPolygon,
        surfaceHa: calculatedArea,
        lastRainDays: 5,
        zoneInterdite: false,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'parcelles'), parcelleData);
      navigate('/parcelles');
    } catch (err) {
      console.error('Error creating parcelle:', err);
      setError('Erreur lors de la création de la parcelle.');
    } finally {
      setLoading(false);
    }
  };

  // ------------------- UI
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => navigate('/parcelles')} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Nouvelle Parcelle</h1>
                <p className="text-sm text-gray-500">Créez une nouvelle parcelle avec l’analyse satellitaire</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content: formulaire à gauche, carte à droite */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de la parcelle</CardTitle>
              <CardDescription>Renseignez les détails de votre nouvelle parcelle</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de la parcelle</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Parcelle Nord" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="culture">Type de culture</Label>
                  <Select value={culture} onValueChange={(v: 'cacao' | 'hevea' | 'palmier') => setCulture(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cacao">Cacao</SelectItem>
                      <SelectItem value="hevea">Hévéa</SelectItem>
                      <SelectItem value="palmier">Palmier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="annee">Année de plantation</Label>
                    <Input id="annee" type="number" value={annee}
                      onChange={(e) => setAnnee(parseInt(e.target.value))} min={1990} max={new Date().getFullYear()} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="densite">Densité (plants/ha)</Label>
                    <Input id="densite" type="number" value={densite}
                      onChange={(e) => setDensite(parseInt(e.target.value))} min={1} required />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Coordonnées GPS</Label>
                    <Button type="button" variant="outline" size="sm" onClick={getCurrentLocation}>
                      <MapPin className="h-4 w-4 mr-2" />
                      Ma position
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lat">Latitude</Label>
                      <Input id="lat" type="number" step="any" value={lat} onChange={(e) => setLat(parseFloat(e.target.value))} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lon">Longitude</Label>
                      <Input id="lon" type="number" step="any" value={lon} onChange={(e) => setLon(parseFloat(e.target.value))} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="radius">Rayon d’analyse (km)</Label>
                      <Input id="radius" type="number" step="0.1" min={0.1}
                        value={radiusKm} onChange={(e) => setRadiusKm(Math.max(0.1, parseFloat(e.target.value)))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Statut & progression</Label>
                      <div>
                        <Progress value={progress} />
                        <div className="text-xs text-muted-foreground mt-1">Statut : {status ?? '—'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading || !generatedPolygon}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Création...' : 'Créer la parcelle'}
                </Button>

                {generatedPolygon && (
                  <p className="text-xs text-muted-foreground pt-2">
                    Polygone sélectionné — Surface estimée : <b>{calculatedArea.toFixed(4)} ha</b>
                  </p>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Carte + Analyse */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Carte & analyse</CardTitle>
                  <CardDescription>Lance l’analyse puis clique sur un polygone pour le sélectionner.</CardDescription>
                </div>
                <Button onClick={runAnalysis}>Analyser</Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Légende */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                {Object.entries(classColors).map(([k, c]) => (
                  <div key={k} className="flex items-center gap-2">
                    <span className="inline-block w-4 h-4 rounded" style={{ background: c, opacity: 0.6 }} />
                    <span className="capitalize">{k.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>

              {/* Carte */}
              <div className="h-[520px] w-full rounded-xl overflow-hidden border">
                <MapContainer
                  whenCreated={onLoad}
                  style={{ width: '100%', height: '100%' }}
                  center={[center.lat, center.lng]}
                  zoom={14}
                  scrollWheelZoom
                >
                  {/* Satellite gratuit Esri */}
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution='&copy; <a href="https://www.esri.com/">Esri</a>, Earthstar Geographics'
                  />

                  <ClickToMoveCenter onMove={(la, lo) => { setLat(la); setLon(lo); }} />

                  <Marker position={[lat, lon]} />
                  <Circle center={[lat, lon]} radius={radiusKm * 1000} />

                  {overlays.map((ov) =>
                    ov.paths.map((ring, i) => (
                      <Polygon
                        key={`${ov.id}-${i}`}
                        positions={ring.map(p => [p.lat, p.lng]) as [number, number][]}
                        pathOptions={{ color: classColors[ov.cls], fillColor: classColors[ov.cls], fillOpacity: 0.35 }}
                        eventHandlers={{ click: () => selectOverlay(ov) }}
                      />
                    ))
                  )}

                  <FitBounds polygons={overlays.map(o => o.paths)} />
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParcelleNew;

// ------------------------------ utils
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
