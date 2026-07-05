import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Stage } from "@/components/sections/Stage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Aetheria" },
      { name: "description", content: "Write to the atelier — stockist enquiries, press, or a private consultation." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(320),
  message: z.string().trim().min(1, "Message is required").max(4000),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
    setBusy(true);
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    setBusy(false);
    if (error) return toast.error(error.message);
    setDone(true);
    toast.success("Message received.");
  };

  return (
    <div className="perspective-2000">
      <Stage label="Contact Header" depth={140} tilt={4} seam={false}>
        <header className="pt-32 pb-12 px-6 md:px-12 max-w-3xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent block mb-4">Write to us</span>
          <h1 className="font-serif italic text-5xl md:text-6xl">Contact.</h1>
        </header>
      </Stage>

      <Stage label="Contact Form" depth={200} tilt={5}>
        <div className="pb-24 px-6 md:px-12 max-w-xl mx-auto">
          {done ? (
            <div className="border-y border-border py-16 text-center">
              <p className="font-serif italic text-3xl mb-3">Thank you.</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">We reply within two business days.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-6">
              <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required max={120} />
              <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required max={320} type="email" />
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Message</span>
                <textarea
                  required
                  maxLength={4000}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={6}
                  className="mt-2 block w-full bg-transparent border-b border-border py-2 outline-none focus:border-foreground text-sm resize-none"
                />
              </label>
              <button
                type="submit"
                disabled={busy}
                className="px-10 py-4 bg-foreground text-background text-[10px] uppercase tracking-[0.3em] hover:bg-accent transition-colors disabled:opacity-50"
              >
                {busy ? "Sending…" : "Send"}
              </button>
            </form>
          )}
        </div>
      </Stage>
    </div>
  );
}

function Field({
  label, value, onChange, required, max, type = "text",
}: { label: string; value: string; onChange: (v: string) => void; required?: boolean; max?: number; type?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
      <input
        type={type}
        required={required}
        maxLength={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 block w-full bg-transparent border-b border-border py-2 outline-none focus:border-foreground text-sm"
      />
    </label>
  );
}
