import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useIsAdmin } from "@/lib/useAuth";
import { Stage } from "@/components/sections/Stage";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Aetheria" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const { data: isAdmin, isLoading } = useIsAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAdmin === false) navigate({ to: "/account" });
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) return <div className="pt-40 text-center text-xs uppercase tracking-widest text-muted-foreground">…</div>;
  if (!isAdmin) return null;

  return (
    <div className="perspective-2000">
      <Stage label="Admin Header" depth={140} tilt={3} seam={false}>
        <header className="pt-32 pb-8 px-6 md:px-12 max-w-6xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent block mb-4">Atelier</span>
          <h1 className="font-serif italic text-5xl md:text-6xl mb-8">Admin</h1>
          <nav className="flex flex-wrap gap-2 border-b border-border pb-6">
            <TabLink to="/admin">Overview</TabLink>
            <TabLink to="/admin/journal">Journal</TabLink>
            <TabLink to="/admin/messages">Messages</TabLink>
            <TabLink to="/admin/orders">Orders</TabLink>
          </nav>
        </header>
      </Stage>
      <div className="pb-24 px-6 md:px-12 max-w-6xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
}

function TabLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: true }}
      className="px-5 py-2 text-[10px] uppercase tracking-[0.25em] border border-border hover:border-foreground data-[status=active]:bg-foreground data-[status=active]:text-background"
    >
      {children}
    </Link>
  );
}
