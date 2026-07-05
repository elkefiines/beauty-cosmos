import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Stage } from "@/components/sections/Stage";
import { useAuth, useIsAdmin } from "@/lib/useAuth";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({ meta: [{ title: "Account — Aetheria" }] }),
  component: AccountPage,
});

function AccountPage() {
  const { user } = useAuth();
  const { data: isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name, marketing_opt_in")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setDisplayName(data.display_name ?? "");
          setOptIn(data.marketing_opt_in ?? false);
        }
      });
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, display_name: displayName.slice(0, 120), marketing_opt_in: optIn });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Saved.");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="perspective-2000">
      <Stage label="Account" depth={140} tilt={4} seam={false}>
        <div className="pt-32 pb-24 px-6 md:px-12 max-w-3xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent block mb-4">Your Ritual</span>
          <h1 className="font-serif italic text-5xl md:text-6xl mb-4">Account</h1>
          <p className="text-sm text-muted-foreground mb-12">{user?.email}</p>

          <form onSubmit={save} className="space-y-8 max-w-md">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Display name</span>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={120}
                className="mt-2 block w-full bg-transparent border-b border-border py-2 outline-none focus:border-foreground text-sm"
              />
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={optIn}
                onChange={(e) => setOptIn(e.target.checked)}
                className="mt-1"
              />
              <span className="text-xs text-muted-foreground">Send me occasional lab notes and new releases.</span>
            </label>
            <button
              type="submit"
              disabled={busy}
              className="px-8 py-3 bg-foreground text-background text-[10px] uppercase tracking-[0.3em] hover:bg-accent transition-colors disabled:opacity-50"
            >
              {busy ? "Saving…" : "Save"}
            </button>
          </form>

          <nav className="mt-16 grid gap-3 border-t border-border pt-8 text-[10px] uppercase tracking-[0.25em]">
            <Link to="/account/orders" className="hover:text-accent">Order history →</Link>
            {isAdmin && <Link to="/admin" className="hover:text-accent">Admin →</Link>}
            <button onClick={signOut} className="text-left text-muted-foreground hover:text-accent">
              Sign out
            </button>
          </nav>
        </div>
      </Stage>
    </div>
  );
}
