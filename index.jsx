import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Single-file demo app for your mini-entreprise
// - Tailwind-based styling (assumes Tailwind is configured)
// - Framer Motion for smooth animations
// - Responsive, Apple-like rounded UI elements
// - Pages: Home, Devis intelligent, Contact
// - Simple "pro" system: sticky navbar, SEO-friendly meta tags, dark mode toggle

// NOTE: Replace placeholders (your name, email, logo) before deploying.

const SITE_TITLE = "Ma Mini Entreprise";
const OWNER_NAME = "[Ton Prénom]";
const CONTACT_EMAIL = "ton.email@example.com"; // replace

// Petite base de données d'items pour estimation automatique (valeurs indicatives)
const ITEM_REFERENCE = {
  "routeur": 60,
  "switch": 40,
  "caméra": 70,
  "nas": 200,
  "disque dur": 80,
  "ssd": 100,
  "pc": 600,
  "alimentation": 50,
  "câble": 5,
  "ondulateur": 150,
  "bornes wifi": 120
};

function formatCurrency(n) {
  return (Math.round(n * 100) / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

function parseItemsText(text) {
  // Accepts multiple line input. Try formats:
  // 1) nom;prix;quantité
  // 2) nom - prix
  // 3) nom (guess price from reference)
  const lines = text.split(/
?
/).map(l => l.trim()).filter(Boolean);
  const items = [];
  for (let ln of lines) {
    // split by ;
    if (ln.includes(";")) {
      const [name, priceStr, qtyStr] = ln.split(";").map(s => s.trim());
      const price = parseFloat(priceStr.replace(/[^0-9.,-]/g, "").replace(",", ".")) || 0;
      const qty = parseInt(qtyStr) || 1;
      items.push({ name, price, qty });
      continue;
    }
    // split by -
    if (ln.includes("-")) {
      const [name, priceStr] = ln.split("-").map(s => s.trim());
      const price = parseFloat(priceStr.replace(/[^0-9.,-]/g, "").replace(",", ".")) || 0;
      items.push({ name, price, qty: 1 });
      continue;
    }
    // fallback: try to detect a number inside line
    const numberMatch = ln.match(/([0-9]+(?:[.,][0-9]+)?)/);
    if (numberMatch) {
      const price = parseFloat(numberMatch[1].replace(",", ".")) || 0;
      const name = ln.replace(numberMatch[0], "").replace(/[()\-:\/]/g, "").trim() || "Matériel";
      items.push({ name, price, qty: 1 });
      continue;
    }
    // final fallback: try reference map
    const key = ln.toLowerCase();
    const price = Object.keys(ITEM_REFERENCE).find(k => key.includes(k)) ? ITEM_REFERENCE[Object.keys(ITEM_REFERENCE).find(k => key.includes(k))] : 0;
    items.push({ name: ln, price, qty: 1 });
  }
  return items;
}

function Header({ page, setPage, dark, setDark }) {
  return (
    <header className="w-full fixed top-0 left-0 z-40 backdrop-blur-md bg-white/60 dark:bg-black/40 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
            {/* Placeholder logo initials */}
            {OWNER_NAME[0] || "M"}
          </div>
          <div>
            <div className="font-semibold text-lg">{SITE_TITLE}</div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400">Solutions & estimations</div>
          </div>
        </div>

        <nav className="flex items-center gap-3">
          <button
            onClick={() => setPage("home")}
            className={`px-3 py-2 rounded-xl ${page === "home" ? "bg-neutral-100 dark:bg-neutral-800" : "hover:bg-neutral-50 dark:hover:bg-neutral-900"}`}
          >
            Accueil
          </button>
          <button
            onClick={() => setPage("devis")}
            className={`px-3 py-2 rounded-xl ${page === "devis" ? "bg-neutral-100 dark:bg-neutral-800" : "hover:bg-neutral-50 dark:hover:bg-neutral-900"}`}
          >
            Devis
          </button>
          <button
            onClick={() => setPage("contact")}
            className={`px-3 py-2 rounded-xl ${page === "contact" ? "bg-neutral-100 dark:bg-neutral-800" : "hover:bg-neutral-50 dark:hover:bg-neutral-900"}`}
          >
            Contact
          </button>

          <div className="w-0.5 h-6 bg-neutral-200 dark:bg-neutral-700 mx-2 rounded" />

          <button
            aria-label="Toggle dark"
            onClick={() => setDark(d => !d)}
            className="px-3 py-2 rounded-2xl hover:scale-105 transition-transform"
          >
            {dark ? "☀️" : "🌙"}
          </button>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="ml-2 px-4 py-2 rounded-2xl bg-indigo-600 text-white shadow hover:brightness-105"
          >
            Devis rapide
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero({ onEstimateClick }) {
  return (
    <section className="pt-28 pb-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Installation & optimisation — rapide, propre, moderne.
          </h1>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl">
            Salut, je suis <strong>{OWNER_NAME}</strong> — je propose des installations réseau, surveillance,
            configuration de solutions pour particuliers et petites entreprises. Obtiens un devis
            instantané en entrant le matériel que tu as déjà.
          </p>

          <div className="mt-6 flex gap-3">
            <button
              onClick={onEstimateClick}
              className="rounded-2xl px-6 py-3 bg-indigo-600 text-white shadow-lg hover:brightness-105"
            >
              Obtenir une estimation
            </button>
            <a href={`mailto:${CONTACT_EMAIL}`} className="rounded-2xl px-6 py-3 border shadow-sm">
              Me contacter
            </a>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-sm text-neutral-600 dark:text-neutral-400">
            <div className="rounded-xl p-3 bg-white/60 dark:bg-white/3 border">
              <div className="font-semibold">Réactivité</div>
              <div className="text-xs">Réponse en <strong>24-48h</strong></div>
            </div>
            <div className="rounded-xl p-3 bg-white/60 dark:bg-white/3 border">
              <div className="font-semibold">Garantie</div>
              <div className="text-xs">Service garanti 30 jours</div>
            </div>
            <div className="rounded-xl p-3 bg-white/60 dark:bg-white/3 border">
              <div className="font-semibold">Paiement</div>
              <div className="text-xs">Facture & paiement sécurisés</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2"
        >
          <div className="rounded-3xl bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800 p-6 shadow-2xl border">
            <div className="rounded-2xl overflow-hidden">
              {/* Mock device panel */}
              <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl">
                <div className="h-44 rounded-xl bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-900 dark:to-neutral-800 flex items-center justify-center text-neutral-500">
                  <div>
                    <div className="text-2xl font-semibold">Calculateur de devis</div>
                    <div className="text-sm mt-1">Tape le matériel que le client a acheté pour estimer le prix.</div>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <input placeholder="Ex: routeur;60;1" className="flex-1 p-3 rounded-xl border" />
                  <button className="px-4 py-3 rounded-xl bg-indigo-600 text-white">Estimer</button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function QuoteCalculator() {
  const [text, setText] = useState(`routeur;60;1
caméra;70;2`);
  const [hourRate, setHourRate] = useState(35);
  const [hours, setHours] = useState(2);
  const [extraCost, setExtraCost] = useState(0);

  const items = useMemo(() => parseItemsText(text), [text]);

  const subtotal = useMemo(() => {
    return items.reduce((s, it) => s + (Number(it.price || 0) * Number(it.qty || 1)), 0);
  }, [items]);

  const labor = useMemo(() => Number(hourRate) * Number(hours), [hourRate, hours]);
  const total = subtotal + labor + Number(extraCost || 0);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="rounded-3xl bg-white dark:bg-neutral-900 p-6 shadow-lg border">
        <h2 className="text-2xl font-semibold">Générateur de devis intelligent</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">Colle ici la liste du matériel que le client a acheté. Exemple de formats valides :</p>

        <ul className="mt-3 list-disc list-inside text-sm text-neutral-600 dark:text-neutral-400">
          <li><code>nom;prix;quantité</code> — ex: <em>routeur;60;1</em></li>
          <li><code>nom - prix</code> — ex: <em>caméra - 70</em></li>
          <li>ou juste <code>nom</code> et le site tentera d'estimer depuis des références</li>
        </ul>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea value={text} onChange={e => setText(e.target.value)} rows={8} className="p-3 rounded-xl border w-full font-mono" />

          <div className="space-y-4">
            <div>
              <label className="text-sm">Taux horaire (€)</label>
              <input type="number" value={hourRate} onChange={e => setHourRate(e.target.value)} className="w-full p-3 rounded-xl border mt-1" />
            </div>
            <div>
              <label className="text-sm">Heures prévues</label>
              <input type="number" value={hours} onChange={e => setHours(e.target.value)} className="w-full p-3 rounded-xl border mt-1" />
            </div>
            <div>
              <label className="text-sm">Coûts supplémentaires (déplacements, pièces)</label>
              <input type="number" value={extraCost} onChange={e => setExtraCost(e.target.value)} className="w-full p-3 rounded-xl border mt-1" />
            </div>

            <div className="mt-2 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border">
              <div className="text-sm text-neutral-600 dark:text-neutral-300">Sous-total matériel</div>
              <div className="text-xl font-semibold">{formatCurrency(subtotal)}</div>
            </div>

            <div className="mt-2 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border">
              <div className="text-sm text-neutral-600 dark:text-neutral-300">Main d'oeuvre</div>
              <div className="text-xl font-semibold">{formatCurrency(labor)}</div>
            </div>

            <div className="mt-2 p-3 rounded-2xl bg-indigo-600 text-white">
              <div className="text-sm">Total estimé</div>
              <div className="text-2xl font-bold">{formatCurrency(total)}</div>
            </div>

            <div className="mt-4 flex gap-2">
              <a className="px-4 py-2 rounded-xl border" href={`mailto:${CONTACT_EMAIL}?subject=Demande%20de%20devis&body=${encodeURIComponent("Bonjour,%0A%0AJe souhaite un devis pour :
" + text + "

Heures estimées : " + hours + "
Taux horaire : " + hourRate)}">Envoyer demande par e‑mail</a>
              <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white">Exporter PDF</button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">Détail</h3>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map((it, i) => (
              <div key={i} className="p-3 rounded-xl border bg-white/50 dark:bg-transparent">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{it.name}</div>
                    <div className="text-sm text-neutral-500">Quantité: {it.qty}</div>
                  </div>
                  <div className="font-semibold">{formatCurrency(it.price * it.qty)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  return (
    <div className="max-w-3xl mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="rounded-3xl bg-white dark:bg-neutral-900 p-6 shadow border">
        <h2 className="text-2xl font-semibold">Contact</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">Remplis ce formulaire pour me contacter — ou envoie directement un e‑mail.</p>

        <div className="mt-4 grid gap-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Ton nom" className="p-3 rounded-xl border" />
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Ton e‑mail" className="p-3 rounded-xl border" />
          <textarea value={message} onChange={e => setMessage(e.target.value)} rows={6} placeholder="Décris ta demande" className="p-3 rounded-xl border" />

          <div className="flex gap-2">
            <button
              onClick={() => window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Contact via site - " + (name || "client"))}&body=${encodeURIComponent(message + "

--
" + name + " - " + email)}`}
              className="px-4 py-2 rounded-2xl bg-indigo-600 text-white"
            >
              Envoyer par e‑mail
            </button>
            <button className="px-4 py-2 rounded-2xl border">Copier message</button>
          </div>

          <div className="mt-4 text-sm text-neutral-500">En envoyant un message, tu acceptes d'être recontacté par {OWNER_NAME} pour finaliser le devis.</div>
        </div>
      </motion.div>

      <div className="mt-6 text-sm text-neutral-500">Téléphone / autre : à ajouter dans la v2.</div>
    </div>
  );
}

export default function MiniEntrepriseSite() {
  const [page, setPage] = useState("home");
  const [dark, setDark] = useState(false);

  return (
    <div className={`${dark ? "dark" : ""} min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors`}>
      <HeadMeta />
      <Header page={page} setPage={setPage} dark={dark} setDark={setDark} />

      <main className="pt-20">
        <AnimatePresence mode="wait">
          {page === "home" && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Hero onEstimateClick={() => setPage("devis")} />

              <section className="max-w-6xl mx-auto px-4 py-8">
                <motion.h3 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl font-semibold">Pourquoi travailler avec moi ?</motion.h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl p-4 bg-white dark:bg-neutral-800 border">
                    <div className="font-semibold">Propre & soigné</div>
                    <div className="text-sm text-neutral-500 mt-1">Câblage, configuration et documentation fournis.</div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="rounded-2xl p-4 bg-white dark:bg-neutral-800 border">
                    <div className="font-semibold">Prix clair</div>
                    <div className="text-sm text-neutral-500 mt-1">Devis instantané, détails et facture.</div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.21 }} className="rounded-2xl p-4 bg-white dark:bg-neutral-800 border">
                    <div className="font-semibold">Support</div>
                    <div className="text-sm text-neutral-500 mt-1">Assistance post-installation 30 jours.</div>
                  </motion.div>
                </div>
              </section>

              <section className="max-w-6xl mx-auto px-4 pb-20">
                <QuotePreviewBlock onOpen={() => setPage("devis")} />
              </section>
            </motion.div>
          )}

          {page === "devis" && (
            <motion.div key="devis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="pt-6 pb-12">
                <QuoteCalculator />
              </div>
            </motion.div>
          )}

          {page === "contact" && (
            <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="pt-6 pb-12">
                <ContactPage />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-12 py-8 border-t border-neutral-100 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 text-sm text-neutral-500">© {new Date().getFullYear()} {OWNER_NAME} — Mini-entreprise. Site démo.</div>
      </footer>
    </div>
  );
}

function QuotePreviewBlock({ onOpen }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-3xl bg-white dark:bg-neutral-900 p-6 shadow border">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-lg font-semibold">Rapide : génère un devis en 2 minutes</div>
          <div className="text-sm text-neutral-500 mt-1">Copie-colle la liste du matériel que le client a déjà acheté et obtiens un prix estimé.</div>
        </div>
        <div className="flex gap-2">
          <button onClick={onOpen} className="px-4 py-2 rounded-2xl bg-indigo-600 text-white">Lancer le calcul</button>
          <a href={`mailto:${CONTACT_EMAIL}`} className="px-4 py-2 rounded-2xl border">Contact rapide</a>
        </div>
      </div>
    </motion.div>
  );
}

function HeadMeta() {
  // Minimal SEO; when you deploy you should set proper <head> tags server-side or using react-helmet / next/head
  return (
    <>
      <meta name="description" content="Installation, configuration et devis instantané — services proposés par une mini-entreprise" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{SITE_TITLE}</title>
    </>
  );
}
