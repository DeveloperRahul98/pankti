import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Pankti — Build your plate. Set your feast.";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(900px 600px at 75% 25%, rgba(232, 163, 61, 0.32), transparent 60%), radial-gradient(700px 500px at 10% 90%, rgba(124, 140, 108, 0.18), transparent 60%), #0e0e0f",
          display: "flex",
          flexDirection: "column",
          padding: "72px",
          color: "#F5EFE6",
          fontFamily: "serif",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 22,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#E8A33D",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 9999,
              background: "#E8A33D",
            }}
          />
          PANKTI · PREMIUM CATERING · HYDERABAD
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            marginTop: 60,
            fontSize: 104,
            lineHeight: 1,
            letterSpacing: -2,
            fontWeight: 700,
            maxWidth: 1000,
          }}
        >
          A plate, made
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 6,
            fontSize: 104,
            lineHeight: 1,
            letterSpacing: -2,
            fontWeight: 700,
          }}
        >
          for{" "}
          <span style={{ color: "#E8A33D", fontStyle: "italic", marginLeft: 18 }}>
            your moment.
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            marginTop: 36,
            fontSize: 30,
            color: "rgba(245, 239, 230, 0.7)",
            maxWidth: 820,
            fontFamily: "sans-serif",
            lineHeight: 1.35,
          }}
        >
          Build the exact plate your guests will remember. South & North Indian,
          made the slow way.
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            color: "rgba(245, 239, 230, 0.6)",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Ring mark */}
            <svg width="44" height="44" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#E8A33D"
                strokeWidth="2.4"
              />
              <path
                d="M20 26 L44 26 M20 33 L44 33 M20 40 L44 40"
                stroke="#E8A33D"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <circle cx="32" cy="14" r="2.6" fill="#F0B357" />
            </svg>
            <div style={{ display: "flex", fontFamily: "serif", fontSize: 38, color: "#F5EFE6" }}>
              Pankti<span style={{ color: "#E8A33D" }}>.</span>
            </div>
          </div>
          <div style={{ display: "flex" }}>pankti.com</div>
        </div>
      </div>
    ),
    size,
  );
}
