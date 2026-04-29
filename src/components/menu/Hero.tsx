import { useConfig } from "@/context/ConfigContext";

export const Hero = () => {
  const config = useConfig();

  // Divide el nombre del restaurante para italizar la última palabra
  const nameParts = config.name.trim().split(" ");
  const lastName = nameParts.pop();
  const firstName = nameParts.join(" ");

  return (
    <header className="relative h-[88vh] min-h-[600px] w-full overflow-hidden">
      <img
        src={config.heroImage}
        alt={`Interior de ${config.name}`}
        className="absolute inset-0 h-full w-full object-cover"
        width={1920}
        height={1280}
      />
      <div className="absolute inset-0 bg-gradient-ink" />
      <div className="absolute inset-0 bg-foreground/30" />

      <div className="relative z-10 flex h-full flex-col">
        {/* Top bar */}
        <nav className="flex items-center justify-between px-6 py-6 md:px-12">
          {/* Logo o nombre */}
          {config.logo ? (
            <img src={config.logo} alt={config.name} className="h-8 object-contain brightness-0 invert" />
          ) : (
            <div className="font-display text-xl tracking-wide text-background md:text-2xl">
              {firstName ? (
                <>{firstName} <em className="font-medium">{lastName}</em></>
              ) : (
                <span className="font-medium">{lastName}</span>
              )}
            </div>
          )}

          <div className="hidden items-center gap-8 text-xs uppercase tracking-[0.2em] text-background/80 md:flex">
            {config.city && config.founded && (
              <>
                <span>{config.city} · {config.founded}</span>
                <span className="h-px w-12 bg-background/40" />
              </>
            )}
            {config.season && <span>{config.season}</span>}
          </div>
        </nav>

        {/* Event banner */}
        {config.eventBanner?.active && (
          <div className="mx-6 mt-2 rounded-sm border border-background/20 bg-background/10 px-4 py-2 backdrop-blur-sm md:mx-12">
            <p className="text-xs text-background/90">
              {config.eventBanner.emoji && <span className="mr-2">{config.eventBanner.emoji}</span>}
              {config.eventBanner.text}
            </p>
          </div>
        )}

        {/* Hero text */}
        <div className="mt-auto px-6 pb-16 md:px-12 md:pb-24">
          <div className="max-w-4xl">
            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-background/70">
              — La carta · {config.season ?? new Date().getFullYear()}
            </p>
            <h1 className="font-display text-5xl font-light leading-[0.95] text-background text-balance md:text-7xl lg:text-[8rem]">
              {config.description
                ? config.description
                : (<>Cocina que se <em className="font-normal italic">contempla</em>,<br />antes de saborearse.</>)
              }
            </h1>
            {config.tagline && (
              <p className="mt-8 max-w-xl text-base leading-relaxed text-background/80 md:text-lg">
                {config.tagline}
              </p>
            )}
          </div>
        </div>

        {/* Scroll cue + reservas CTA */}
        <div className="absolute bottom-8 right-8 hidden flex-col items-end gap-3 md:flex">
          {config.reservas && (
            <a
              href={config.reservas}
              className="rounded-full border border-background/40 bg-background/10 px-5 py-2 text-xs uppercase tracking-[0.2em] text-background backdrop-blur-sm transition-colors hover:bg-background/20"
            >
              Reservar mesa
            </a>
          )}
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-background/70">
            <span className="h-px w-10 bg-background/40" />
            Desliza
          </div>
        </div>
      </div>
    </header>
  );
};