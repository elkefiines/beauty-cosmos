import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Stage } from "@/components/sections/Stage";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — Aetheria" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Supabase places the recovery access_token in the URL hash and the client
    // consumes it into a session automatically. We just wait until a session exists.
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) setReady(true);
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return toast.error("At least 8 characters.");
    if (password !== confirm) return toast.error("Passwords don't match.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated.");
    navigate({ to: "/account" });
  };

  return (
    <div className="perspective-2000">
      <Stage label="Reset" depth={140} tilt={4} seam={false}>
        <div className="pt-32 pb-24 px-6 md:px-12 max-w-md mx-auto">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent block mb-4">Set a new password</span>
          <h1 className="font-serif italic text-5xl md:text-6xl mb-12">Reset.</h1>

          {!ready ? (
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Open this page from the reset link in your email. If nothing loads, request a new link from{" "}
              <Link to="/auth" className="text-accent">sign in</Link>.
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-6">
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">New password</span>
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 block w-full bg-transparent border-b border-border py-2 outline-none focus:border-foreground text-sm"
                />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Confirm password</span>
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="mt-2 block w-full bg-transparent border-b border-border py-2 outline-none focus:border-foreground text-sm"
                />
              </label>
              <button
                type="submit"
                disabled={busy}
                className="w-full py-4 bg-foreground text-background text-[10px] uppercase tracking-[0.3em] hover:bg-accent transition-colors disabled:opacity-50"
              >
                {busy ? "…" : "Update password"}
              </button>
            </form>
          )}
        </div>
      </Stage>
    </div>
  );
}
