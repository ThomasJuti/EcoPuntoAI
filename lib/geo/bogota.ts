export type LatLng = { lat: number; lng: number };

/** Bogotá D.C. bounding box. Tight enough to drop Chía, Soacha centro, La Calera. */
export const BOGOTA_BOUNDS = {
  south: 4.46,
  north: 4.837,
  west: -74.22,
  east: -74.01,
};

export function isInBogota(lat: number, lng: number) {
  return (
    lat >= BOGOTA_BOUNDS.south &&
    lat <= BOGOTA_BOUNDS.north &&
    lng >= BOGOTA_BOUNDS.west &&
    lng <= BOGOTA_BOUNDS.east
  );
}

const LOCALITIES: { name: string; keys: string[]; lat: number; lng: number }[] = [
  { name: "Usaquén", keys: ["usaquen", "usaquén"], lat: 4.72, lng: -74.031 },
  { name: "Chapinero", keys: ["chapinero"], lat: 4.653, lng: -74.063 },
  { name: "Santa Fe", keys: ["santa fe", "santafe"], lat: 4.609, lng: -74.068 },
  { name: "San Cristóbal", keys: ["san cristobal", "san cristóbal"], lat: 4.548, lng: -74.088 },
  { name: "Usme", keys: ["usme"], lat: 4.505, lng: -74.106 },
  { name: "Tunjuelito", keys: ["tunjuelito"], lat: 4.572, lng: -74.132 },
  { name: "Bosa", keys: ["bosa"], lat: 4.615, lng: -74.19 },
  { name: "Kennedy", keys: ["kennedy"], lat: 4.627, lng: -74.153 },
  { name: "Fontibón", keys: ["fontibon", "fontibón"], lat: 4.678, lng: -74.141 },
  { name: "Engativá", keys: ["engativa", "engativá"], lat: 4.701, lng: -74.107 },
  { name: "Suba", keys: ["suba"], lat: 4.741, lng: -74.084 },
  { name: "Barrios Unidos", keys: ["barrios unidos"], lat: 4.67, lng: -74.073 },
  { name: "Teusaquillo", keys: ["teusaquillo"], lat: 4.64, lng: -74.09 },
  { name: "Los Mártires", keys: ["martires", "mártires", "los martires"], lat: 4.605, lng: -74.09 },
  { name: "Antonio Nariño", keys: ["antonio narino", "antonio nariño"], lat: 4.59, lng: -74.106 },
  { name: "Puente Aranda", keys: ["puente aranda"], lat: 4.616, lng: -74.117 },
  { name: "La Candelaria", keys: ["candelaria", "la candelaria"], lat: 4.596, lng: -74.074 },
  { name: "Rafael Uribe Uribe", keys: ["rafael uribe"], lat: 4.565, lng: -74.116 },
  { name: "Ciudad Bolívar", keys: ["ciudad bolivar", "ciudad bolívar"], lat: 4.541, lng: -74.154 },
];

function fold(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function geocodeLocality(query: string): (LatLng & { name: string }) | null {
  const q = fold(query);
  if (!q) return null;
  const hit = LOCALITIES.find((l) => l.keys.some((k) => fold(k) === q || q.includes(fold(k))));
  if (!hit) return null;
  if (!isInBogota(hit.lat, hit.lng)) return null;
  return { lat: hit.lat, lng: hit.lng, name: hit.name };
}

/** Plaza de Bolívar — origin when GPS and locality are both missing. */
export const BOGOTA_CENTER: LatLng = { lat: 4.5981, lng: -74.0758 };
