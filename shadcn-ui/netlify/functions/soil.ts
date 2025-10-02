// netlify/functions/soil.ts
import type { Handler } from "@netlify/functions";

// Mémoire simple pour simuler des jobs
const mem: Record<string, any> = {};

const handler: Handler = async (event) => {
  const { httpMethod, path } = event;
  const prefix = "/.netlify/functions/soil/soil-segmentation";

  // Préflight CORS (utile en dev local)
  if (httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization,Accept",
      },
      body: "",
    };
  }

  // 1) POST /api/soil-segmentation
  if (httpMethod === "POST" && path === prefix) {
    const body = JSON.parse(event.body || "{}");
    const { lat, lng, radius_km } = body;

    // Crée un job terminé (mock)
    const jobId = Math.random().toString(36).slice(2);
    mem[jobId] = { status: "done", progress: 100, lat, lng, r: radius_km || 0.5 };

    return json({ jobId });
  }

  // 2) GET /api/soil-segmentation/:jobId/status
  if (httpMethod === "GET" && path.endsWith("/status") && path.startsWith(prefix + "/")) {
    const jobId = path.split("/").slice(-2, -1)[0];
    const job = mem[jobId];
    if (!job) return json({ status: "failed", detail: "unknown jobId" }, 404);
    return json({ status: job.status, progress: job.progress });
  }

  // 3) GET /api/soil-segmentation/:jobId/result
  if (httpMethod === "GET" && path.endsWith("/result") && path.startsWith(prefix + "/")) {
    const jobId = path.split("/").slice(-2, -1)[0];
    const job = mem[jobId];
    if (!job) return json({ error: "unknown jobId" }, 404);

    // Petit GeoJSON de démo: 3 polygones (sol nu, culture, forêt)
    const { lat, lng, r } = job;
    const d = (r || 0.5) * 0.009; // ~km→deg approximatif
    const fc = {
      type: "FeatureCollection",
      features: [
        feat("bare_soil", square(lng - d, lat + d, d / 3)),
        feat("crop",      square(lng + d / 4, lat,     d / 3)),
        feat("forest",    square(lng - d / 4, lat - d / 4, d / 3)),
      ],
    };
    return json(fc);
  }

  return json({ error: "Not found" }, 404);
};

function square(cx: number, cy: number, half: number) {
  return [
    [cx - half, cy - half],
    [cx + half, cy - half],
    [cx + half, cy + half],
    [cx - half, cy + half],
    [cx - half, cy - half],
  ];
}
function feat(cls: string, ring: number[][]) {
  return {
    type: "Feature",
    properties: { class: cls },
    geometry: { type: "Polygon", coordinates: [ring] },
  };
}
function json(obj: any, status = 200) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  };
}

export { handler };
