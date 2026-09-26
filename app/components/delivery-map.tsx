"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import type { LatLng } from "@/lib/geo/bogota";
import { osrmFootUrl, pointAlong, routeOrStraight } from "@/lib/geo/route";
import { MASCOT_POSES } from "./mascot";

type Props = {
  title: string;
  origin: LatLng;
  point: LatLng;
  playing: boolean;
  delivered: boolean;
  onArrive: () => void;
};

const WALK_MS = 4000;
const ROUTE_TIMEOUT_MS = 4000;

function pinIcon(L: typeof Leaflet, delivered: boolean) {
  return L.divIcon({
    className: "",
    html: `<div class="delivery-pin${delivered ? " is-delivered" : ""}"><span>${delivered ? "✓" : ""}</span></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
  });
}

async function fetchRoute(from: LatLng, to: LatLng): Promise<LatLng[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ROUTE_TIMEOUT_MS);
  try {
    const res = await fetch(osrmFootUrl(from, to), { signal: controller.signal });
    return routeOrStraight(res.ok ? await res.json() : null, from, to);
  } catch {
    return [from, to];
  } finally {
    clearTimeout(timer);
  }
}

/** Leaflet map where the mascot walks the route from origin to the point. */
export function DeliveryMap({
  title,
  origin,
  point,
  playing,
  delivered,
  onArrive,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<{ L: typeof Leaflet; map: Leaflet.Map; pin: Leaflet.Marker } | null>(null);
  const onArriveRef = useRef(onArrive);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onArriveRef.current = onArrive;
  }, [onArrive]);

  useEffect(() => {
    let cancelled = false;
    let map: Leaflet.Map | null = null;
    void import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;
      map = L.map(containerRef.current, {
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: false,
      });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(map);
      L.marker([origin.lat, origin.lng], {
        icon: L.divIcon({ className: "", html: '<div class="delivery-origin"></div>', iconSize: [14, 14] }),
        interactive: false,
        keyboard: false,
      }).addTo(map);
      const pin = L.marker([point.lat, point.lng], {
        icon: pinIcon(L, false),
        interactive: false,
        keyboard: false,
      }).addTo(map);
      map.fitBounds(
        L.latLngBounds([origin.lat, origin.lng], [point.lat, point.lng]),
        { padding: [36, 36], maxZoom: 16 },
      );
      leafletRef.current = { L, map, pin };
      setReady(true);
    });
    return () => {
      cancelled = true;
      leafletRef.current = null;
      map?.remove();
    };
  }, [origin.lat, origin.lng, point.lat, point.lng]);

  useEffect(() => {
    const leaflet = leafletRef.current;
    if (!ready || !leaflet) return;
    leaflet.pin.setIcon(pinIcon(leaflet.L, delivered));
  }, [ready, delivered]);

  useEffect(() => {
    const leaflet = leafletRef.current;
    if (!ready || !playing || !leaflet) return;
    const { L, map } = leaflet;
    let cancelled = false;
    let frame = 0;
    const layers: Leaflet.Layer[] = [];

    void fetchRoute(origin, point).then((path) => {
      if (cancelled) return;
      const latlngs = path.map((p) => L.latLng(p.lat, p.lng));
      layers.push(
        L.polyline(latlngs, {
          color: "#3a3d42",
          opacity: 0.35,
          weight: 4,
          dashArray: "2 8",
          interactive: false,
        }).addTo(map),
      );
      const walked = L.polyline([latlngs[0]], {
        color: "#389040",
        weight: 5,
        interactive: false,
      }).addTo(map);
      const avatar = L.marker(latlngs[0], {
        icon: L.divIcon({
          className: "",
          html: `<img src="${MASCOT_POSES.map}" alt="" class="delivery-avatar" />`,
          iconSize: [40, 52],
          iconAnchor: [20, 50],
        }),
        interactive: false,
        keyboard: false,
        zIndexOffset: 1000,
      }).addTo(map);
      layers.push(walked, avatar);
      map.fitBounds(L.latLngBounds(latlngs), { padding: [36, 36], maxZoom: 16 });

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        walked.setLatLngs(latlngs);
        avatar.setLatLng(latlngs[latlngs.length - 1]);
        onArriveRef.current();
        return;
      }

      const start = performance.now();
      const step = (now: number) => {
        if (cancelled) return;
        const t = Math.min((now - start) / WALK_MS, 1);
        const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
        const { at, index, eastward } = pointAlong(path, eased);
        const here = L.latLng(at.lat, at.lng);
        avatar.setLatLng(here);
        walked.setLatLngs([...latlngs.slice(0, index + 1), here]);
        avatar.getElement()?.firstElementChild?.classList.toggle("is-west", !eastward);
        if (t < 1) frame = requestAnimationFrame(step);
        else onArriveRef.current();
      };
      frame = requestAnimationFrame(step);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      for (const layer of layers) layer.remove();
    };
  }, [ready, playing, origin, point]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={title}
      className="delivery-map mt-5 h-60 w-full overflow-hidden rounded-2xl bg-petroleum/5"
    />
  );
}
