import { isInBogota } from "@/lib/geo/bogota";
import { isWasteKind, type WasteKind } from "./kinds";
import type { CollectionPoint } from "./ranking";

export type PointFields = Omit<CollectionPoint, "id" | "lastVerifiedAt"> & {
  id?: string;
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseAccepted(value: unknown): WasteKind[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is WasteKind =>
      typeof item === "string" && isWasteKind(item) && item !== "unknown",
  );
}

export function parsePointCreate(body: unknown): CollectionPoint {
  if (!body || typeof body !== "object") throw new Error("Cuerpo inválido");
  const row = body as Record<string, unknown>;
  const name = asString(row.name);
  const address = asString(row.address);
  const locality = asString(row.locality);
  const hours = asString(row.hours);
  const lat = Number(row.lat);
  const lng = Number(row.lng);
  const accepted = parseAccepted(row.accepted);
  if (!name || !address || !locality || !hours) {
    throw new Error("Faltan nombre, dirección, localidad u horario");
  }
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || !isInBogota(lat, lng)) {
    throw new Error("Las coordenadas deben estar en Bogotá");
  }
  if (accepted.length === 0) throw new Error("Elige al menos un residuo");
  const id = asString(row.id) || crypto.randomUUID();
  const contact = asString(row.contact) || null;
  const isActive = row.isActive !== false;
  return {
    id,
    name,
    address,
    lat,
    lng,
    locality,
    hours,
    contact,
    accepted,
    isActive,
    lastVerifiedAt: new Date().toISOString().slice(0, 10),
  };
}

export function parsePointPatch(body: unknown): Partial<CollectionPoint> {
  if (!body || typeof body !== "object") throw new Error("Cuerpo inválido");
  const row = body as Record<string, unknown>;
  const patch: Partial<CollectionPoint> = {};
  if ("name" in row) patch.name = asString(row.name);
  if ("address" in row) patch.address = asString(row.address);
  if ("locality" in row) patch.locality = asString(row.locality);
  if ("hours" in row) patch.hours = asString(row.hours);
  if ("contact" in row) {
    patch.contact = asString(row.contact) || null;
  }
  if ("isActive" in row) patch.isActive = row.isActive !== false;
  if ("lat" in row || "lng" in row) {
    const lat = Number(row.lat);
    const lng = Number(row.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || !isInBogota(lat, lng)) {
      throw new Error("Las coordenadas deben estar en Bogotá");
    }
    patch.lat = lat;
    patch.lng = lng;
  }
  if ("accepted" in row) {
    const accepted = parseAccepted(row.accepted);
    if (accepted.length === 0) throw new Error("Elige al menos un residuo");
    patch.accepted = accepted;
  }
  if (Object.keys(patch).length === 0) throw new Error("Nada que actualizar");
  patch.lastVerifiedAt = new Date().toISOString().slice(0, 10);
  return patch;
}
