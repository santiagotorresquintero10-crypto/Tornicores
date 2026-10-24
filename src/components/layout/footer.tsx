import logo from "@/assets/brand/logo-torniracores.png";
import { BUSINESS } from "@/config/business";
import { CREDITS } from "@/data/credits";
import { NAV_LINKS } from "./navbar";
import { scrollToId } from "@/lib/utils";

/**
 * The page lifts away to uncover the footer underneath (curtain). The
 * original logo closes the page at full width.
 */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="sticky bottom-0 z-0 bg-graphite-2 text-white" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Información de contacto
      </h2>
      <div className="frame frame-max flex min-h-[88svh] flex-col justify-between gap-16 pb-8 pt-20 md:pt-28">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          <div>
            <p className="text-[1.0625rem] font-bold">Contacto</p>
            <ul className="mt-3 space-y-2 text-[1rem] text-steel-soft">
              <li>
                <a className="hover:text-yellow" href={`https://wa.me/${BUSINESS.whatsapp}`} target="_blank" rel="noreferrer">
                  WhatsApp {BUSINESS.whatsappDisplay}
                </a>
              </li>
              <li>
                <a className="break-all hover:text-yellow" href={`mailto:${BUSINESS.email}`}>
                  {BUSINESS.email}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-[1.0625rem] font-bold">Navegación</p>
            <ul className="mt-3 space-y-2 text-[1rem] text-steel-soft">
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <a
                    className="hover:text-yellow"
                    href={`#${l.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(l.id);
                    }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[1.0625rem] font-bold">Sede</p>
            <ul className="mt-3 space-y-2 text-[1rem] text-steel-soft">
              <li>{BUSINESS.address ?? "Dirección por WhatsApp"}</li>
              <li>{BUSINESS.hours ?? "Horario por confirmar"}</li>
            </ul>
          </div>
          <div>
            <p className="text-[1.0625rem] font-bold">Imágenes</p>
            <details className="mt-3 text-[1rem] text-steel-soft">
              <summary className="cursor-pointer hover:text-white">Créditos de fotografías de referencia</summary>
              <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-2 text-[0.875rem]">
                {CREDITS.map((c) => (
                  <li key={c.url}>
                    <a href={c.url} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-white">
                      “{c.title}”
                    </a>
                    {c.author ? ` de ${c.author}` : ""},{" "}
                    <a href={c.licenceUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-white">
                      {c.licence}
                    </a>
                    , vía {c.source}
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </div>

        <div>
          <img src={logo} alt={`${BUSINESS.name}, ${BUSINESS.tagline}`} width={935} height={215} loading="lazy" className="h-auto w-full" />
          <p className="mt-6 text-[0.875rem] text-steel">
            © {year} {BUSINESS.name}. Catálogo, referencias y marcas de demostración hasta cargar el inventario real.
          </p>
        </div>
      </div>
    </footer>
  );
}
