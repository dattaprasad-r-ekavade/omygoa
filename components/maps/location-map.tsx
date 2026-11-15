"use client";

import dynamic from "next/dynamic";

const Inner = dynamic(() => import("./location-map-inner"), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-3xl bg-[var(--gp-blue)]" />,
});

export function LocationMap(props: { lat: number; lng: number; label: string }) {
  return <Inner {...props} />;
}
