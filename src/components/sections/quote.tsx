import * as React from "react";
import { ImagePlus, Send, Share2, Trash2 } from "lucide-react";
import { BUSINESS } from "@/config/business";
import { Button } from "@/components/ui/button";
import { useSiteActions } from "@/context/site-actions";
import { EMPTY_QUOTE, quoteMessage, whatsappUrl, type QuoteDraft } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const VEHICLES = ["Automóvil", "Camioneta", "Camión / bus", "Moto", "Maquinaria / industria", "Otro"];
type Errors = Partial<Record<"name" | "phone" | "product" | "quantity", string>>;

function validate(q: QuoteDraft): Errors {
  const e: Errors = {};
  if (!q.name.trim()) e.name = "Escribe tu nombre.";
  const digits = q.phone.replace(/\D/g, "");
  if (!digits) e.phone = "Escribe un teléfono para responderte.";
  else if (digits.length < 7 || digits.length > 13) e.phone = "Revisa el número: debe tener entre 7 y 13 dígitos.";
  if (!q.product.trim()) e.product = "Dinos qué pieza o referencia buscas.";
  const n = Number(q.quantity);
  if (!q.quantity.trim() || !Number.isFinite(n) || n < 1) e.quantity = "La cantidad debe ser 1 o más.";
  return e;
}

const fieldBase =
  "block w-full rounded-[2px] bg-[#ffd25c] px-4 text-[1.0625rem] font-medium text-ink placeholder:text-[#6b5313] focus:bg-white focus:outline-none focus-visible:outline-[3px] focus-visible:outline-offset-0 focus-visible:outline-ink aria-[invalid=true]:bg-white aria-[invalid=true]:outline aria-[invalid=true]:outline-[3px] aria-[invalid=true]:outline-[#b42318]";

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[1rem] font-bold">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[1rem] font-semibold text-[#8a1c12]">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[0.875rem]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function SlipRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline py-1.5">
      <dt className="shrink-0 text-[1rem] font-semibold">{label}</dt>
      <span className="leader" aria-hidden />
      <dd className="max-w-[60%] truncate text-right text-[1rem]">{value}</dd>
    </div>
  );
}

export function Quote() {
  const { quoteProduct, quoteNonce } = useSiteActions();
  const [q, setQ] = React.useState<QuoteDraft>(EMPTY_QUOTE);
  const [errors, setErrors] = React.useState<Errors>({});
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<{ kind: "opened" | "blocked" | "shared" | "share-cancelled"; url?: string } | null>(null);
  const productRef = React.useRef<HTMLInputElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  // "Cotizar" anywhere on the page lands here with the product filled in.
  React.useEffect(() => {
    if (!quoteNonce) return;
    if (quoteProduct) setQ((d) => ({ ...d, product: quoteProduct }));
    setStatus(null);
    const t = window.setTimeout(() => productRef.current?.focus({ preventScroll: true }), 650);
    return () => clearTimeout(t);
  }, [quoteNonce, quoteProduct]);

  React.useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const draft = { ...q, hasImage: !!file };
  const message = quoteMessage(draft);
  const canShareFile = React.useMemo(() => {
    if (!file || typeof navigator === "undefined" || !navigator.canShare) return false;
    try {
      return navigator.canShare({ files: [file] });
    } catch {
      return false;
    }
  }, [file]);

  const set = (k: keyof QuoteDraft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setQ((d) => ({ ...d, [k]: e.target.value }));
    if (errors[k as keyof Errors]) setErrors((x) => ({ ...x, [k]: undefined }));
    setStatus(null);
  };

  const check = () => {
    const e = validate(q);
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`#q-${first}`)?.focus();
      return false;
    }
    return true;
  };

  const sendWhatsApp = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!check()) return;
    const url = whatsappUrl(message);
    // Opened without "noopener" so a blocked popup is detectable (null),
    // then the new tab is detached from this page.
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    setStatus({ kind: win ? "opened" : "blocked", url });
  };

  const shareWithPhoto = async () => {
    if (!check() || !file) return;
    try {
      await navigator.share({ text: message, files: [file] });
      setStatus({ kind: "shared" });
    } catch {
      setStatus({ kind: "share-cancelled" });
    }
  };

  const err = (k: keyof Errors) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `q-${k}-error` : undefined,
  });

  return (
    <section id="cotizar" aria-labelledby="cotizar-title" className="bg-graphite-2 py-24 md:py-32">
      <div className="frame frame-max">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="cotizar-title" className="display h2 lg:col-span-7">
            Pide tu cotización.
          </h2>
          <p className="max-w-[46ch] text-[1.125rem] leading-[1.55] text-steel-soft lg:col-span-5">
            Llena el cupón, revisa la orden y envíala por WhatsApp. Te responde directamente la tienda.
          </p>
        </div>

        <div className="mt-12 grid items-start gap-6 lg:grid-cols-12">
          {/* The coupon */}
          <form
            ref={formRef}
            noValidate
            onSubmit={sendWhatsApp}
            aria-describedby="cotizar-ayuda"
            className="relative bg-yellow text-ink lg:col-span-8 lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)] coupon-notches"
          >
            <div className="flex flex-col justify-between gap-6 p-6 sm:p-8 lg:p-10">
              <div>
                <p className="text-[clamp(1.625rem,2.1vw,2.125rem)] font-[850] uppercase leading-[0.95] [font-stretch:100%]">
                  Cupón de cotización
                </p>
                <p id="cotizar-ayuda" className="mt-4 text-[1.0625rem] leading-[1.5]">
                  Los campos con * son necesarios. Mientras más datos des (referencia, marca, vehículo), más rápido
                  identificamos la pieza.
                </p>
              </div>
              <p className="text-[1rem] font-semibold">
                WhatsApp {BUSINESS.whatsappDisplay}
                <br />
                {BUSINESS.email}
              </p>
            </div>

            <div className="grid gap-4 border-dotted border-ink/50 p-6 pt-0 sm:grid-cols-2 sm:p-8 sm:pt-0 lg:border-l-[5px] lg:p-10">
              <Field id="q-name" label="Nombre *" error={errors.name}>
                <input id="q-name" autoComplete="name" value={q.name} onChange={set("name")} className={cn(fieldBase, "h-13")} {...err("name")} />
              </Field>
              <Field id="q-phone" label="Teléfono *" error={errors.phone}>
                <input
                  id="q-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={q.phone}
                  onChange={set("phone")}
                  className={cn(fieldBase, "h-13")}
                  {...err("phone")}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field id="q-product" label="Producto o referencia *" error={errors.product}>
                  <input
                    ref={productRef}
                    id="q-product"
                    value={q.product}
                    onChange={set("product")}
                    placeholder="Ej.: válvula relevadora, perno M12, referencia original…"
                    className={cn(fieldBase, "h-13")}
                    {...err("product")}
                  />
                </Field>
              </div>
              <Field id="q-vehicle" label="Tipo de vehículo">
                <select id="q-vehicle" value={q.vehicle} onChange={set("vehicle")} className={cn(fieldBase, "h-13")}>
                  <option value="">No aplica / no sé</option>
                  {VEHICLES.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </Field>
              <Field id="q-quantity" label="Cantidad *" error={errors.quantity}>
                <input
                  id="q-quantity"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={q.quantity}
                  onChange={set("quantity")}
                  className={cn(fieldBase, "tabular h-13")}
                  {...err("quantity")}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field id="q-notes" label="Observaciones">
                  <textarea
                    id="q-notes"
                    rows={3}
                    value={q.notes}
                    onChange={set("notes")}
                    placeholder="Marca y modelo del vehículo, medidas, si la necesitas con urgencia…"
                    className={cn(fieldBase, "resize-y py-3")}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <span className="mb-1.5 block text-[1rem] font-bold">Foto de la pieza (opcional)</span>
                {file && preview ? (
                  <div className="flex items-center gap-3 bg-[#ffd25c] p-2.5">
                    <img src={preview} alt="Vista previa de la foto elegida" className="h-16 w-16 object-cover" />
                    <p className="min-w-0 flex-1 truncate text-[1rem] font-medium">{file.name}</p>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="flex h-11 w-11 items-center justify-center rounded-[2px] bg-ink text-white hover:bg-graphite-3"
                      aria-label="Quitar foto"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="q-photo"
                    className="flex h-13 cursor-pointer items-center gap-2.5 rounded-[2px] bg-[#ffd25c] px-4 text-[1.0625rem] font-semibold transition-colors focus-within:outline focus-within:outline-[3px] focus-within:outline-ink hover:bg-white"
                  >
                    <ImagePlus className="h-5 w-5" aria-hidden />
                    Elegir foto
                    <input
                      id="q-photo"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        setFile(e.target.files?.[0] ?? null);
                        setStatus(null);
                      }}
                    />
                  </label>
                )}
                {file && !canShareFile ? (
                  <p className="mt-1.5 text-[0.875rem]">
                    WhatsApp no recibe fotos desde un enlace web: cuando se abra el chat, adjúntala con el clip.
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2.5 sm:col-span-2 sm:flex-row">
                <Button type="submit" variant="ink" size="lg" className="flex-1">
                  <Send aria-hidden />
                  Enviar por WhatsApp
                </Button>
                {canShareFile ? (
                  <Button type="button" variant="light" size="lg" className="flex-1" onClick={shareWithPhoto}>
                    <Share2 aria-hidden />
                    Compartir con foto
                  </Button>
                ) : null}
              </div>

              <div aria-live="polite" className="sm:col-span-2">
                {status?.kind === "opened" ? (
                  <p className="bg-ink p-4 text-[1rem] leading-snug text-white">
                    Abrimos WhatsApp con tu mensaje listo. Revísalo y pulsa enviar en el chat; la solicitud se envía desde
                    ahí. ¿No se abrió?{" "}
                    <a href={status.url} target="_blank" rel="noreferrer" className="font-bold text-yellow underline underline-offset-4">
                      Abrir WhatsApp
                    </a>
                  </p>
                ) : null}
                {status?.kind === "blocked" ? (
                  <p className="bg-ink p-4 text-[1rem] text-white">
                    El navegador bloqueó la ventana.{" "}
                    <a href={status.url} target="_blank" rel="noreferrer" className="font-bold text-yellow underline underline-offset-4">
                      Abrir WhatsApp
                    </a>
                  </p>
                ) : null}
                {status?.kind === "shared" ? (
                  <p className="bg-ink p-4 text-[1rem] text-white">
                    Se abrió el menú para compartir. Si elegiste WhatsApp, termina el envío desde el chat.
                  </p>
                ) : null}
                {status?.kind === "share-cancelled" ? (
                  <p className="bg-ink p-4 text-[1rem] text-white">No se compartió nada. Puedes intentarlo de nuevo.</p>
                ) : null}
              </div>
            </div>
          </form>

          {/* The order slip: exactly what will be sent */}
          <aside aria-label="Vista previa de la orden" className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="zigzag-bottom bg-[#f3f4f6] px-6 pt-7 text-ink">
              <p className="text-[1.625rem] font-[850] uppercase italic leading-none [font-stretch:115%]">{BUSINESS.name}</p>
              <p className="mt-1 text-[1rem] font-semibold text-[#4b5058]">Orden de cotización</p>
              <dl className="mt-5">
                <SlipRow label="Nombre" value={q.name || "—"} />
                <SlipRow label="Teléfono" value={q.phone || "—"} />
                <SlipRow label="Pieza" value={q.product || "—"} />
                <SlipRow label="Vehículo" value={q.vehicle || "—"} />
                <SlipRow label="Cantidad" value={q.quantity || "—"} />
                <SlipRow label="Foto" value={file ? "Sí" : "No"} />
              </dl>
              <details className="mt-4 text-[1rem]">
                <summary className="cursor-pointer font-bold">Ver el mensaje exacto</summary>
                <pre className="mt-3 whitespace-pre-wrap break-words bg-white p-3 font-sans text-[1rem] leading-snug">
                  {message}
                </pre>
              </details>
              <p className="mt-5 flex h-11 items-center justify-center bg-ink px-3 text-center text-[0.875rem] font-bold text-white">
                Destino: WhatsApp {BUSINESS.whatsappDisplay}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
