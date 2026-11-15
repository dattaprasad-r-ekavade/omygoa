import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? "OmyGoa").slice(0, 120);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fffbf4",
          color: "#1e2740",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#22417f", fontWeight: 700 }}>OmyGoa</div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1 }}>{title}</div>
        <div style={{ display: "flex", fontSize: 24, color: "#48526d" }}>Goa, All Here.</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
