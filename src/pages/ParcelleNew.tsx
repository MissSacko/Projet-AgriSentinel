import React, { useState } from 'react';
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
import { ArrowLeft, MapPin, Save } from 'lucide-react';

import Sizer from '@/components/Sizer';

// -------------------- Types API --------------------
type AgroClass = 'bare_soil' | 'crop' | 'forest';
type AgroProps = { class: AgroClass };
type AgroFC = GeoJSON.FeatureCollection<GeoJSON.Geometry, AgroProps>;

// URL API (sans slash final)
const API_BASE = (import.meta.env.VITE_AGRO_API || '').replace(/\/+$/, '');

// -------------------- Utils --------------------
async function fetchJson<T = any>(
  url: string,
  options: RequestInit = {},
  timeoutMs = 20000
): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(url, { ...options, signal: controller.signal, mode: 'cors' });
    const text = await resp.text();
    // essaie json si possible
    const maybeJson = (() => { try { return JSON.parse(text); } catch { return text; }})();

    if (!resp.ok) {
      const msg = typeof maybeJson === 'string'
        ? `HTTP ${resp.status} – ${maybeJson || 'Erreur'}`
        : `HTTP ${resp.status} – ${JSON.stringify(maybeJson, null, 2)}`;
      throw new Error(msg);
    }
    return (typeof maybeJson === 'string' ? (text as unknown as T) : (maybeJson as T));
  } catch (e: any) {
    if (e?.name === 'AbortError') {
      throw new Error(`Timeout (${timeoutMs} ms) sur ${url}`);
    }
    // Message clair pour CORS / DNS / HTTPS mixé
    const hint =
      `\nAstuce: vérifie l'URL (${API_BASE}), le HTTPS, les en-têtes CORS côté API, ` +
      `et qu'il n'y a pas de double "//" dans l'URL.`;
    throw new Error(`${e?.message || e}${hint}`);
  } finally {
    clearTimeout(id);
  }
}

const ParcelleNew: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form
  const [name, setName] = useState('');
  const [culture, setCulture] = useState<'cacao' | 'hevea' | 'palmier'>('cacao');
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [densite, setDensite] = useState(100);

  // Coord par défaut (Abidjan env.)
  const [lat, setLat] = useState(5.3364);
  const [lon, setLon] = useState(-4.0267);

  // Polygone de la parcelle (généré dans Sizer)
  const [generatedPolygon, setGeneratedPolygon] = useState<GeoJSON.Feature<GeoJSON.Polygon> | null>(null);
  const [calculatedArea, setCalculatedArea] = useState<number>(0);

  // Segmentation API
  const [radiusKm, setRadiusKm] = useState<number>(1);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [segmentationFc, setSegmentationFc] = useState<AgroFC | null>(null);

  // -------------------- Geoloc --------------------
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Géolocalisation non supportée par votre navigateur.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLat(pos.coords.latitude); setLon(pos.coords.longitude); },
      (err) => { console.error(err); setError("Impossible d'obtenir votre position."); }
    );
  };

  // -------------------- Sizer callback --------------------
  const handlePolygonGenerated = (polygon: GeoJSON.Feature<GeoJSON.Polygon>, areaHa: number) => {
    setGeneratedPolygon(polygon);
    setCalculatedArea(areaHa);
  };

  // -------------------- Appel API AgroSentinel --------------------
  const runSegmentation = async () => {
    setApiError('');
    setSegmentationFc(null);

    // validations rapides évitent erreurs bêtes
    if (!API_BASE) {
      setApiError("URL d'API manquante. Définis VITE_AGRO_API dans le fichier .env (sans slash final).");
      return;
    }
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      setApiError('Coordonnées invalides.');
      return;
    }

    setApiLoading(true);
    try {
      // 1) POST start -> jobId
      const startData = await fetchJson<{ jobId: string }>(
        `${API_BASE}/api/soil-segmentation`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', accept: 'application/json' },
          body: JSON.stringify({ lat, lng: lon, radius_km: radiusKm }),
        },
        25000
      );

      // 2) GET result
      const jobId = encodeURIComponent(startData.jobId);
      const fc = await fetchJson<AgroFC>(
        `${API_BASE}/api/soil-segmentation/${jobId}/result`,
        { headers: { accept: 'application/json' } },
        30000
      );

      setSegmentationFc(fc);
    } catch (e: any) {
      setApiError(e?.message || String(e));
    } finally {
      setApiLoading(false);
    }
  };

  // -------------------- Enregistrement Firestore --------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setError('Utilisateur non connecté.'); return; }
    if (!generatedPolygon) { setError('Aucun polygone de parcelle généré.'); return; }

    setLoading(true);
    setError('');
    try {
      await addDoc(collection(db, 'parcelles'), {
        ownerUid: user.uid,
        name, culture, annee, densite,
        geomGeoJSON: generatedPolygon,
        surfaceHa: calculatedArea,
        segmentation: segmentationFc ?? null, // ok si null
        lastRainDays: 5,
        zoneInterdite: false,
        createdAt: new Date().toISOString(),
      });
      navigate('/parcelles');
    } catch (err: any) {
      console.error(err);
      setError('Erreur lors de la création de la parcelle.');
    } finally {
      setLoading(false);
    }
  };

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
                <p className="text-sm text-gray-500">Créez une nouvelle parcelle avec le générateur GPS</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
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
                    <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
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
                    <Input id="annee" type="number" value={annee} onChange={(e) => setAnnee(parseInt(e.target.value))} min={1990} max={new Date().getFullYear()} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="densite">Densité (plants/ha)</Label>
                    <Input id="densite" type="number" value={densite} onChange={(e) => setDensite(parseInt(e.target.value))} min={1} required />
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
                </div>

                {/* Bloc API */}
                <div className="space-y-3 p-3 rounded-md border">
                  <div className="grid grid-cols-2 gap-4 items-end">
                    <div className="space-y-2">
                      <Label htmlFor="radius">Rayon d’analyse (km)</Label>
                      <Input id="radius" type="number" step="0.1" value={radiusKm} onChange={(e)=>setRadiusKm(parseFloat(e.target.value || '0'))} />
                    </div>
                    <div className="flex justify-end">
                      <Button type="button" onClick={runSegmentation} disabled={apiLoading}>
                        {apiLoading ? 'Analyse…' : 'Analyser avec AgroSentinel'}
                      </Button>
                    </div>
                  </div>

                  {apiError && (
                    <Alert variant="destructive">
                      <AlertDescription style={{whiteSpace:'pre-wrap'}}>{apiError}</AlertDescription>
                    </Alert>
                  )}

                  {!!segmentationFc && (
                    <div className="text-sm text-gray-700">
                      <div className="font-semibold mb-1">Résultat :</div>
                      <div>Features: {segmentationFc.features.length}</div>
                      <div>
                        Classes:&nbsp;
                        {(['bare_soil','crop','forest'] as AgroClass[]).map(c => {
                          const n = segmentationFc.features.filter(f => f.properties?.class === c).length;
                          return <span key={c}>{c} ({n})&nbsp;</span>;
                        })}
                      </div>
                    </div>
                  )}
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
              </form>
            </CardContent>
          </Card>

          {/* Carte + Masques */}
          <Sizer
            lat={lat}
            lon={lon}
            radiusKm={radiusKm}
            segmentation={segmentationFc}
            onPolygonGenerated={handlePolygonGenerated}
          />
        </div>
      </div>
    </div>
  );
};

export default ParcelleNew;
