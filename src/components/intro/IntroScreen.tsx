import { useEffect, useRef, useState } from "react";
import { useConfig } from "@/context/ConfigContext";

interface Props {
  onDone: () => void;
}

export function IntroScreen({ onDone }: Props) {
  const config = useConfig();
  const wipeRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const ease = (t: number) =>
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const DELAY = 300;
    const WIPE = 1250;
    const PAUSE = 360;
    const FADE = 550;

    let startTime: number | null = null;
    let raf: number;

    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;

      if (elapsed < DELAY) {
        raf = requestAnimationFrame(step);
        return;
      }

      const raw = Math.min((elapsed - DELAY) / WIPE, 1);
      const pct = ease(raw) * 100;

      if (wipeRef.current) {
        wipeRef.current.style.clipPath = `inset(0 ${(100 - pct).toFixed(2)}% 0 0)`;
      }
      if (lineRef.current) {
        lineRef.current.style.left = `${pct.toFixed(2)}%`;
        lineRef.current.style.opacity = raw < 0.98 ? "1" : "0";
      }

      if (raw < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);

    const exitTimer = setTimeout(() => {
      setExiting(true);
      setTimeout(onDone, FADE);
    }, DELAY + WIPE + PAUSE);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(exitTimer);
    };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      style={{
        opacity: exiting ? 0 : 1,
        transition: exiting ? `opacity ${0.55}s ease-in` : "none",
      }}
    >
      {/* Layer 1: aged sepia */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${config.heroImage})`,
          filter: "sepia(0.92) contrast(1.18) brightness(0.5) saturate(0.18)",
        }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/></svg>")`,
          mixBlendMode: "multiply",
          opacity: 0.15,
        }}
      />

      {/* Layer 2: color — wiped in from left */}
      <div
        ref={wipeRef}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${config.heroImage})`,
          clipPath: "inset(0 100% 0 0)",
        }}
      />

      {/* Vertical glow line tracking the wipe edge */}
      <div
        ref={lineRef}
        className="absolute top-0 bottom-0 w-px pointer-events-none"
        style={{
          left: "0%",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.7) 25%, white 50%, rgba(255,255,255,0.7) 75%, transparent 100%)",
          boxShadow:
            "0 0 6px 2px rgba(255,255,255,0.55), 0 0 18px 5px rgba(255,255,255,0.18)",
          opacity: 0,
          transition: "opacity 0.1s",
        }}
      />

      {/* Dark gradient overlay for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Text */}
      <div className="absolute bottom-14 left-8 right-8 animate-intro-text">
        {config.founded && (
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/55 mb-2">
            Est. {config.founded}
          </p>
        )}
        <h1 className="font-display text-5xl font-light text-white leading-tight text-shadow">
          {config.name}
        </h1>
        {config.tagline && (
          <p className="mt-2 text-sm text-white/65 tracking-wide">
            {config.tagline}
          </p>
        )}
      </div>

      {/* Scanline effect top */}
      <div
        className="absolute top-0 left-0 right-0 h-12 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
