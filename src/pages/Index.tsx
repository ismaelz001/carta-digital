import { useEffect, useMemo, useRef, useState } from "react";
import { Hero } from "@/components/menu/Hero";
import { CategoryNav } from "@/components/menu/CategoryNav";
import { DishCard } from "@/components/menu/DishCard";
import { DishModal } from "@/components/menu/DishModal";
import { AllergenFilter } from "@/components/menu/AllergenFilter";
import { MobileBottomNav } from "@/components/menu/MobileBottomNav";
import { DailyMenuBanner } from "@/components/menu/DailyMenuBanner";
import { useConfig } from "@/context/ConfigContext";
import type { Dish } from "@/types/config";

const Index = () => {
  const config = useConfig();
  const [active, setActive] = useState<string>(config.categories[0]?.id ?? "");
  const [openDish, setOpenDish] = useState<Dish | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({});

  // Agrupar platos disponibles por categoría, aplicando filtros
  const grouped = useMemo(() => {
    return config.categories.map((c) => ({
      ...c,
      items: config.dishes.filter((d) => {
        if (d.available === false) return false;
        if (d.category !== c.id) return false;
        if (activeFilters.length === 0) return true;
        // Mostrar solo platos que tienen TODOS los filtros activos
        return activeFilters.every((f) => d.tags?.includes(f));
      }),
    }));
  }, [config, activeFilters]);

  // Todos los tags únicos de la carta para el filtro
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    config.dishes.forEach((d) => d.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [config.dishes]);

  const scrollTo = (id: string) => {
    setActive(id);
    const el = sectionsRef.current[id];
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Actualizar categoría activa al hacer scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    Object.values(sectionsRef.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [grouped]);

  return (
    <main className="min-h-screen bg-background">
      <Hero />

      {/* Menú del día */}
      {config.dailyMenu?.active && <DailyMenuBanner menu={config.dailyMenu} />}

      <CategoryNav active={active} onChange={scrollTo} />

      {/* Filtros alérgenos/dieta */}
      <AllergenFilter
        tags={allTags}
        active={activeFilters}
        onChange={setActiveFilters}
      />

      <div className="mx-auto max-w-7xl px-6 pb-32 pt-8 md:px-12">
        {grouped.map((cat, ci) => (
          <section
            key={cat.id}
            id={cat.id}
            ref={(el) => (sectionsRef.current[cat.id] = el)}
            className="scroll-mt-32 pb-28"
          >
            {/* Cabecera editorial de sección */}
            <div className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-primary">
                  — Capítulo {String(ci + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-4 font-display text-5xl font-light leading-none text-foreground md:text-7xl">
                  {cat.label}
                </h2>
              </div>
              {cat.subtitle && (
                <p className="max-w-sm text-sm leading-relaxed text-muted-foreground md:text-right">
                  {cat.subtitle}. Una selección cuidada con ingredientes de proximidad y temporada.
                </p>
              )}
            </div>

            {cat.items.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay platos disponibles con los filtros seleccionados.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                {cat.items.map((dish, idx) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    index={idx}
                    onOpen={setOpenDish}
                  />
                ))}
              </div>
            )}
          </section>
        ))}

        {/* Footer */}
        <footer className="mt-16 border-t border-border pt-12 text-center">
          {config.footerQuote && (
            <>
              <p className="font-display text-2xl italic text-foreground md:text-3xl">
                "{config.footerQuote}"
              </p>
              {config.footerQuoteAuthor && (
                <p className="mt-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  — {config.footerQuoteAuthor}
                </p>
              )}
              <div className="mx-auto my-10 h-px w-16 bg-border" />
            </>
          )}

          {/* Horario */}
          {config.openingHours && config.openingHours.length > 0 && (
            <div className="mb-8 flex flex-wrap justify-center gap-6">
              {config.openingHours.map((h, i) => (
                <div key={i} className="text-center">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{h.label}</p>
                  <p className="mt-0.5 text-xs text-foreground">{h.hours}</p>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {config.name}
            {config.address && ` · ${config.address}`}
            {config.city && ` · ${config.city}`}
            {config.phone && ` · ${config.phone}`}
          </p>

          {/* Redes sociales */}
          {config.social && (
            <div className="mt-6 flex justify-center gap-4">
              {config.social.instagram && (
                <a
                  href={config.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
                >
                  Instagram
                </a>
              )}
              {config.social.facebook && (
                <a
                  href={config.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
                >
                  Facebook
                </a>
              )}
              {config.social.tripadvisor && (
                <a
                  href={config.social.tripadvisor}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
                >
                  TripAdvisor
                </a>
              )}
            </div>
          )}

          {/* Powered by Rodorte */}
          <p className="mt-8 text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50">
            Carta digital by{" "}
            <a
              href="https://rodorte.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-muted-foreground"
            >
              Rodorte
            </a>
          </p>
        </footer>
      </div>

      {/* Bottom nav móvil */}
      <MobileBottomNav
        categories={config.categories}
        active={active}
        onNav={scrollTo}
        reservas={config.reservas}
        mapsUrl={config.mapsUrl}
      />

      <DishModal dish={openDish} onClose={() => setOpenDish(null)} />
    </main>
  );
};

export default Index;
