import type { WasteKind } from "./kinds";
import { isWasteKind } from "./kinds";
import type { CollectionPoint } from "./ranking";

export type PointRow = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  locality: string;
  hours: string;
  contact: string | null;
  accepted: string[];
  is_active: boolean;
  last_verified_at: string;
};

export function pointFromRow(row: PointRow): CollectionPoint {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    lat: row.lat,
    lng: row.lng,
    locality: row.locality,
    hours: row.hours,
    contact: row.contact,
    accepted: row.accepted.filter(isWasteKind),
    isActive: row.is_active,
    lastVerifiedAt: row.last_verified_at,
  };
}

export function pointToRow(point: CollectionPoint): PointRow {
  return {
    id: point.id,
    name: point.name,
    address: point.address,
    lat: point.lat,
    lng: point.lng,
    locality: point.locality,
    hours: point.hours,
    contact: point.contact,
    accepted: point.accepted as string[],
    is_active: point.isActive,
    last_verified_at: point.lastVerifiedAt,
  };
}

export function pointPatchToRow(patch: Partial<CollectionPoint>): Partial<PointRow> {
  const row: Partial<PointRow> = {};
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.address !== undefined) row.address = patch.address;
  if (patch.lat !== undefined) row.lat = patch.lat;
  if (patch.lng !== undefined) row.lng = patch.lng;
  if (patch.locality !== undefined) row.locality = patch.locality;
  if (patch.hours !== undefined) row.hours = patch.hours;
  if (patch.contact !== undefined) row.contact = patch.contact;
  if (patch.accepted !== undefined) row.accepted = patch.accepted as WasteKind[];
  if (patch.isActive !== undefined) row.is_active = patch.isActive;
  if (patch.lastVerifiedAt !== undefined) row.last_verified_at = patch.lastVerifiedAt;
  return row;
}
