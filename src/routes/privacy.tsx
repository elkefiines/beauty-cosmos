import { createFileRoute } from "@tanstack/react-router";
import { Stage } from "@/components/sections/Stage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — Aetheria" },
      { name: "description", content: "How Aetheria collects, uses, and protects your personal information." },
    ],
  }),
  component: () => (
    <div className="perspective-2000">
      <Stage label="Privacy" depth={120} tilt={3} seam={false}>
        <article className="pt-32 pb-24 px-6 md:px-12 max-w-2xl mx-auto space-y-8 text-sm leading-relaxed text-foreground/85">
          <header>
            <span className="text-[10px] uppercase tracking-[0.3em] text-accent block mb-4">Legal</span>
            <h1 className="font-serif italic text-5xl mb-3">Privacy.</h1>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Last updated · 2026</p>
          </header>

          <section>
            <h2 className="font-serif italic text-2xl mb-3">What we collect</h2>
            <p>
              To send you an order and remember your ritual we collect: your name, email,
              shipping address, order history, and — if you opt in — your marketing preference.
              We do not collect payment card details; checkout is a simulated demo mode and no
              charge is made.
            </p>
          </section>

          <section>
            <h2 className="font-serif italic text-2xl mb-3">How we use it</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Fulfil and confirm your orders.</li>
              <li>Reply when you write to us through the contact form.</li>
              <li>Send occasional lab notes and new-release announcements — only if you subscribe.</li>
              <li>Keep our shop and journal secure against abuse.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif italic text-2xl mb-3">Cookies &amp; local storage</h2>
            <p>
              Your bag is remembered with a browser-local session identifier so items persist
              between visits. Sign-in uses a first-party session cookie. We do not run
              third-party analytics or advertising trackers.
            </p>
          </section>

          <section>
            <h2 className="font-serif italic text-2xl mb-3">Sharing</h2>
            <p>
              We never sell your data. We share only what is strictly needed with our hosting
              provider and, where you have opted in, with our newsletter processor.
            </p>
          </section>

          <section>
            <h2 className="font-serif italic text-2xl mb-3">Your rights</h2>
            <p>
              You may request a copy or deletion of your data at any time by writing to the
              atelier. We honour requests within 30 days. Under the GDPR you may also lodge a
              complaint with your local supervisory authority.
            </p>
          </section>

          <section>
            <h2 className="font-serif italic text-2xl mb-3">Contact</h2>
            <p>
              Aetheria Atelier · Brussels, Belgium · <a href="/contact" className="text-accent hover:underline">contact form</a>.
            </p>
          </section>
        </article>
      </Stage>
    </div>
  ),
});
