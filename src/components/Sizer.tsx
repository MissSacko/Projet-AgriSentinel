import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Circle, GeoJSON } from 'react-leaflet';
import L, { LatLngExpression, PathOptions } from 'leaflet';

// corrige l’icône par défaut sous Vite
import 'leaflet/dist/leaflet.css';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type AgroClass = 'bare_soil' | 'crop' | 'forest';
type AgroProps = { class: AgroClass };
type AgroFC = GeoJSON.FeatureCollection<GeoJSON.Geometry, AgroProps>;

type Props = {
  lat: number;
  lon: number;
  radiusKm?: number;
  segmentation?: AgroFC | null;
  onPolygonGenerated?: (polygon: GeoJSON.Feature<GeoJSON.Polygon>, areaHa: number) => void;
};

const classStyles: Record<AgroClass, PathOptions> = {
  bare_soil: { color: '#a0522d', weight: 1, fillOpacity: 0.35 }, // brun
  crop:      { color: '#2e8b57', weight: 1, fillOpacity: 0.35 }, // vert moyen
  forest:    { color: '#006400', weight: 1, fillOpacity: 0.35 }, // vert foncé
};

// approx mètres/deg
function metersToDegrees(latDeg: number, meters: number): { dLat: number; dLon: number } {
  const dLat = meters / 111320; // ~m par degré latitude
  const dLon = meters / (111320 * Math.cos((latDeg * Math.PI) / 180));
  return { dLat, dLon };
}

// carré ~100 m autour du point -> polygon GeoJSON + aire (ha)
function squareAround(lat: number, lon: number, sideMeters = 100) {
  const half = sideMeters / 2;
  const { dLat, dLon } = metersToDegrees(lat, half);
  const coords: [number, number][] = [
    [lon - dLon, lat - dLat],
    [lon + dLon, lat - dLat],
    [lon + dLon, lat + dLat],
    [lon - dLon, lat + dLat],
    [lon - dLon, lat - dLat],
  ];
  // aire approx (projection plate locale) : side^2
  const area_m2 = sideMeters * sideMeters;
  const area_ha = area_m2 / 10000;
  const polygon: GeoJSON.Feature<GeoJSON.Polygon> = {
    type: 'Feature',
    geometry: { type: 'Polygon', coordinates: [coords] },
    properties: {},
  };
  return { polygon, area_ha };
}

function FlyTo({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => { map.flyTo(center, Math.max(map.getZoom(), 14), { duration: 0.6 }); }, [center, map]);
  return null;
}

const Sizer: React.FC<Props> = ({ lat, lon, radiusKm = 1, segmentation, onPolygonGenerated }) => {
  const center = useMemo<LatLngExpression>(() => [lat, lon], [lat, lon]);

  const [localPoly, setLocalPoly] = useState<GeoJSON.Feature<GeoJSON.Polygon> | null>(null);
  const [localArea, setLocalArea] = useState<number>(0);

  useEffect(() => {
    // génère un petit carré par défaut pour donner un polygone exploitable
    const { polygon, area_ha } = squareAround(lat, lon, 100);
    setLocalPoly(polygon);
    setLocalArea(area_ha);
    onPolygonGenerated?.(polygon, area_ha);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lon]);

  const segmentationKey = useMemo(() => JSON.stringify(segmentation ?? {}).length, [segmentation]);

  return (
    <div className="w-full h-[540px] rounded-lg overflow-hidden border bg-white">
      <MapContainer center={center} zoom={13} style={{ width: '100%', height: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyTo center={center} />
        {/* Point demandé */}
        <Marker position={center} />

        {/* Buffer visuel */}
        <Circle center={center} radius={radiusKm * 1000} pathOptions={{ color: '#1a73e8', weight: 1 }} />

        {/* Polygone local (carré ~100 m) */}
        {localPoly && (
          <GeoJSON
            key={`poly-${localPoly.geometry.coordinates[0][0].join(',')}`}
            data={localPoly as any}
            style={{ color: '#8b5cf6', weight: 2, fillOpacity: 0.2 }}
          />
        )}

        {/* === Masques de l'API (GeoJSON) === */}
        {segmentation && (
          <GeoJSON
            key={`seg-${segmentationKey}`}
            data={segmentation as any}
            style={(feat) => {
              const c = (feat?.properties as any)?.class as AgroClass;
              return classStyles[c] ?? { color: '#3388ff', weight: 1, fillOpacity: 0.3 };
            }}
            onEachFeature={(feature, layer) => {
              const c = (feature.properties as any)?.class as AgroClass | undefined;
              const label =
                c === 'bare_soil' ? 'Sol nu' :
                c === 'crop'      ? 'Zone cultivée' :
                c === 'forest'    ? 'Zone forestière' : 'Inconnu';
              layer.bindPopup(`<b>${label}</b>`);
            }}
          />
        )}
      </MapContainer>

      <div className="p-3 text-sm text-gray-700">
        <div><b>Centre</b> : {lat.toFixed(6)}, {lon.toFixed(6)} — <b>Rayon</b> : {radiusKm} km</div>
        {localPoly && <div><b>Parcelle locale</b> : ~{localArea.toFixed(3)} ha (carré 100 m)</div>}
        {segmentation && (
          <div className="mt-1">
            <b>Masques</b> : {segmentation.features.length} features
          </div>
        )}
      </div>
    </div>
  );
};

export default Sizer;
