import type { CartItem } from "@/pages/Index";

interface Props {
  items: CartItem[];
  open: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
  onQtyChange: (id: string, qty: number) => void;
}

export function CartPanel({ items, open, onClose, onRemove, onQtyChange }: Props) {
  const total = items.reduce((s, i) => s + i.dish.price * i.qty, 0);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className="fixed inset-y-0 right-0 z-50 w-full max-w-sm flex flex-col bg-[#141210] border-l border-white/8 transition-transform duration-300"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
        aria-hidden={!open}
        role="dialog"
        aria-label="Mi lista"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-safe-top py-5 border-b border-white/8 flex-shrink-0 pt-6">
          <div>
            <h2 className="font-display text-xl font-light text-white">Mi lista</h2>
            <p className="text-[11px] text-white/40 mt-0.5">
              {items.length === 0
                ? "Vacía"
                : `${items.reduce((s, i) => s + i.qty, 0)} artículos`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-full bg-white/8 flex items-center justify-center hover:bg-white/12 transition-colors"
            aria-label="Cerrar"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
              <line x1="1" y1="1" x2="13" y2="13"/>
              <line x1="13" y1="1" x2="1" y2="13"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 pb-16">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </div>
              <p className="text-sm text-white/30 text-center">
                Añade platos para<br/>guardar tu selección
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {items.map(({ dish, qty }) => (
                <div key={dish.id} className="flex items-center gap-3 px-5 py-3.5">
                  {/* Image */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[#1a1714]">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold uppercase tracking-wide text-white truncate">
                      {dish.name}
                    </p>
                    <p className="text-[12px] text-white/50 mt-0.5">
                      {dish.price.toFixed(2).replace(".", ",")}€ c/u
                    </p>
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => onQtyChange(dish.id, qty - 1)}
                      className="w-7 h-7 rounded-full bg-white/8 flex items-center justify-center hover:bg-white/15 transition-colors"
                      aria-label="Reducir cantidad"
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                        <line x1="2" y1="5" x2="8" y2="5"/>
                      </svg>
                    </button>
                    <span className="text-sm font-semibold text-white min-w-[16px] text-center">
                      {qty}
                    </span>
                    <button
                      onClick={() => onQtyChange(dish.id, qty + 1)}
                      className="w-7 h-7 rounded-full bg-white/8 flex items-center justify-center hover:bg-white/15 transition-colors"
                      aria-label="Aumentar cantidad"
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                        <line x1="5" y1="2" x2="5" y2="8"/>
                        <line x1="2" y1="5" x2="8" y2="5"/>
                      </svg>
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => onRemove(dish.id)}
                    className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-colors text-white/30 flex-shrink-0"
                    aria-label={`Eliminar ${dish.name}`}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <line x1="1" y1="1" x2="9" y2="9"/>
                      <line x1="9" y1="1" x2="1" y2="9"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="flex-shrink-0 border-t border-white/8 px-5 py-5 pb-safe-bottom" style={{ paddingBottom: "max(env(safe-area-inset-bottom), 20px)" }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-white/60">Total estimado</span>
              <span className="text-lg font-semibold text-white">
                {total.toFixed(2).replace(".", ",")}€
              </span>
            </div>

            <button className="w-full bg-primary text-white font-semibold py-3.5 rounded-2xl uppercase tracking-wide text-sm hover:bg-primary/80 transition-colors">
              Llamar al camarero
            </button>

            <p className="text-center text-[10px] text-white/25 mt-3">
              Muestra esta lista al camarero
            </p>
          </div>
        )}
      </div>
    </>
  );
}
