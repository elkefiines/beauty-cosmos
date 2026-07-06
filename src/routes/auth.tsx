import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Stage } from "@/components/sections/Stage";

const searchSchema = z.object({ from: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in — Aetheria" },
      { name: "description", content: "Sign in or create an account to review orders and save your rituals." },
    ],
  }),
  component: AuthPage,
});

const credSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(320),
  password: z.string().min(8, "At least 8 characters").max(128),
});

function AuthPage() {
  const { from } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: from ?? "/account" });
    });
  }, [from, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = credSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: window.location.origin + "/auth" },
        });
        if (error) throw error;
        toast.success("Account created. Signing you in…");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        toast.success("Welcome back.");
      }
      navigate({ to: from ?? "/account" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="perspective-2000">
      <Stage label="Auth" depth={140} tilt={4} seam={false}>
        <div className="pt-32 pb-24 px-6 md:px-12 max-w-md mx-auto">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent block mb-4">
            {mode === "signin" ? "Return to the atelier" : "Begin your ritual"}
          </span>
          <h1 className="font-serif italic text-5xl md:text-6xl mb-12">
            {mode === "signin" ? "Sign in." : "Create an account."}
          </h1>

          <form onSubmit={submit} className="space-y-6">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full bg-transparent border-b border-border py-2 outline-none focus:border-foreground text-sm"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Password</span>
              <input
                type="password"
                required
                minLength={8}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full bg-transparent border-b border-border py-2 outline-none focus:border-foreground text-sm"
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="w-full py-4 bg-foreground text-background text-[10px] uppercase tracking-[0.3em] hover:bg-accent transition-colors disabled:opacity-50"
            >
              {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="mt-8 flex flex-col gap-3 text-[10px] uppercase tracking-[0.25em]">
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-left text-muted-foreground hover:text-accent"
            >
              {mode === "signin" ? "No account? Create one →" : "Already have one? Sign in →"}
            </button>
            {mode === "signin" && (
              <button
                onClick={async () => {
                  if (!email) return toast.error("Enter your email above first.");
                  const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin + "/reset-password",
                  });
                  if (error) return toast.error(error.message);
                  toast.success("Reset link sent. Check your email.");
                }}
                className="text-left text-muted-foreground hover:text-accent"
              >
                Forgot password? →
              </button>
            )}
          </div>

          <div className="mt-16 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <Link to="/" className="hover:text-accent">← Back to atelier</Link>
          </div>
        </div>
      </Stage>
    </div>
  );
}
