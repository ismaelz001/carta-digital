import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-5 text-center"
      style={{
        background: "#080F22",
        fontFamily: "'Bricolage Grotesque', sans-serif",
      }}
    >
      <p
        style={{
          fontFamily: "'Rufina', serif",
          fontSize: "clamp(6rem, 20vw, 12rem)",
          fontWeight: 700,
          color: "#1B2F5A",
          lineHeight: 1,
          letterSpacing: "-0.02em",
          userSelect: "none",
        }}
      >
        404
      </p>

      <h1
        style={{
          fontFamily: "'Rufina', serif",
          fontSize: "clamp(1.4rem, 3vw, 2rem)",
          fontWeight: 700,
          color: "#fff",
          marginTop: "0.5rem",
        }}
      >
        Este plato no está en la carta
      </h1>

      <p
        className="mt-3 max-w-xs leading-relaxed"
        style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}
      >
        La página que buscas no existe, pero nuestro menú del día sí.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="px-6 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105 hover:brightness-110"
          style={{ background: "#D4A017", color: "#1B2F5A", boxShadow: "0 4px 20px rgba(212,160,23,0.35)" }}
        >
          Volver al inicio
        </Link>
        <Link
          to="/carta"
          className="px-6 py-3 rounded-full font-semibold text-sm border transition-all hover:bg-white/10"
          style={{ borderColor: "rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.8)" }}
        >
          Ver la carta
        </Link>
      </div>

      <p className="mt-12 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
        Café Bar Polígono · Santiago de Compostela
      </p>
    </div>
  );
};

export default NotFound;
