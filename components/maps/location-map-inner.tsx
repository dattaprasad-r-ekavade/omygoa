"use client";

import { useEffect, useRef } from "react";

export default function LocationMapInner({ lat, lng, label }: { lat: number; lng: number; label: string }) {
  const node = useRef<HTMLDivElement>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!token || !node.current) return;
    let map: { remove: () => void } | null = null;
    let cancelled = false;
    void (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      await import("mapbox-gl/dist/mapbox-gl.css");
      if (cancelled || !node.current) return;
      mapboxgl.accessToken = token;
      const instance = new mapboxgl.Map({
        container: node.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [lng, lat],
        zoom: 12,
      });
      new mapboxgl.Marker({ color: "#22417f" }).setLngLat([lng, lat]).setPopup(new mapboxgl.Popup().setText(label)).addTo(instance);
      map = instance;
    })();
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [token, lat, lng, label]);

  if (!token) {
    return (
      <div className="grid h-64 place-items-center rounded-3xl bg-[var(--gp-blue)] px-6 text-center text-sm text-[var(--gp-blue-ink)]">
        <p>
          {label}
          <br />
          Mapbox loads when <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> is set.
        </p>
      </div>
    );
  }
  return <div ref={node} className="h-64 overflow-hidden rounded-3xl" />;
}
