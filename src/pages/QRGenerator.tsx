// ─────────────────────────────────────────────────────────────────────────────
// QRGenerator — página para generar y descargar el QR de un cliente
// Acceso: /qr  (solo en desarrollo / uso interno de Rodorte)
// Genera QR apuntando a la URL de producción del cliente
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useRef } from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { Download, Copy, Check } from "lucide-react";

const QRGenerator = () => {
  const [url, setUrl] = useState("https://cartas.rodorte.com/casa-olivo");
  const [name, setName] = useState("Casa Olivo");
  const [color, setColor] = useState("#1a1006");
  const [bg, setBg] = useState("#f5f0e8");
  const [size, setSize] = useState(300);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const downloadSVG = () => {
    const svg = canvasRef.current?.querySelector("svg");
    if (!svg) return;
    const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `qr-${name.toLowerCase().replace(/\s+/g, "-")}.svg`;
    a.click();
  };

  const downloadPNG = () => {
    const canvas = document.createElement("canvas");
    const padding = 32;
    canvas.width = size + padding * 2;
    canvas.height = size + padding * 2 + 48; // extra para el nombre
    const ctx = canvas.getContext("2d")!;

    // Fondo
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // QR usando canvas oculto
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    document.body.appendChild(tempContainer);

    const tempCanvas = document.createElement("canvas");
    tempContainer.appendChild(tempCanvas);

    // Dibujamos el QR en el canvas temporal usando la API de qrcode.react
    // workaround: usar el canvas hidden que ya está en el DOM
    const hiddenCanvas = document.querySelector("#qr-hidden canvas") as HTMLCanvasElement | null;
    if (hiddenCanvas) {
      ctx.drawImage(hiddenCanvas, padding, padding, size, size);
    }

    // Nombre del restaurante
    ctx.fillStyle = color;
    ctx.font = `bold ${Math.round(size * 0.05)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(name, canvas.width / 2, size + padding + 36);

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `qr-${name.toLowerCase().replace(/\s+/g, "-")}.png`;
    a.click();

    document.body.removeChild(tempContainer);
  };

  const copyUrl = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-16 md:px-12">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">— Rodorte</p>
          <h1 className="mt-4 font-display text-5xl font-light text-foreground">
            Generador de QR
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            Genera el código QR para la carta digital de cada cliente. Descárgalo en SVG (para imprenta) o PNG.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2">
          {/* Controles */}
          <div className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                URL de la carta
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 rounded-sm border border-border bg-card px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="https://cartas.rodorte.com/cliente"
                />
                <button
                  onClick={copyUrl}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-border text-muted-foreground hover:text-foreground transition-colors"
                  title="Copiar URL"
                >
                  {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Nombre del restaurante
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-sm border border-border bg-card px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Nombre del local"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Color QR
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-10 w-10 cursor-pointer rounded-sm border border-border"
                  />
                  <span className="text-sm text-muted-foreground font-mono">{color}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Fondo
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bg}
                    onChange={(e) => setBg(e.target.value)}
                    className="h-10 w-10 cursor-pointer rounded-sm border border-border"
                  />
                  <span className="text-sm text-muted-foreground font-mono">{bg}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Tamaño: {size}px
              </label>
              <input
                type="range"
                min={200}
                max={600}
                step={50}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            {/* Acciones */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={downloadSVG}
                className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Download className="h-4 w-4" />
                SVG (imprenta)
              </button>
              <button
                onClick={downloadPNG}
                className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Download className="h-4 w-4" />
                PNG
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="flex flex-col items-center gap-6">
            <div
              ref={canvasRef}
              className="rounded-md p-8 shadow-soft"
              style={{ backgroundColor: bg }}
            >
              <QRCodeSVG
                value={url || "https://rodorte.com"}
                size={size}
                fgColor={color}
                bgColor={bg}
                level="H"
                includeMargin={false}
              />
              {name && (
                <p
                  className="mt-4 text-center text-sm font-semibold"
                  style={{ color, fontFamily: "sans-serif" }}
                >
                  {name}
                </p>
              )}
            </div>

            {/* Canvas oculto para descarga PNG */}
            <div id="qr-hidden" className="sr-only" aria-hidden>
              <QRCodeCanvas
                value={url || "https://rodorte.com"}
                size={size}
                fgColor={color}
                bgColor={bg}
                level="H"
              />
            </div>

            <p className="max-w-xs text-center text-xs text-muted-foreground">
              El QR apunta directamente a la URL. Entrégalo al cliente en alta resolución para imprenta, plastificado o en soporte de mesa.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default QRGenerator;
