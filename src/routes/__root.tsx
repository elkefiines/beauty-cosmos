import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { FooterStage } from "../components/sections/FooterStage";
import { MotionProvider } from "../lib/motion";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-serif italic text-foreground">404</h1>
        <p className="mt-4 text-sm uppercase tracking-[0.25em] text-muted-foreground">
          The page you seek doesn't exist.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center px-8 py-3 border border-foreground text-[10px] uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-colors"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-serif italic text-foreground">Something went quiet.</h1>
        <p className="mt-3 text-xs text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="px-6 py-3 bg-foreground text-background text-[10px] uppercase tracking-[0.3em] hover:bg-accent transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="px-6 py-3 border border-foreground text-[10px] uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-colors"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Botanica — Hand-Distilled Apothecary" },
      { name: "description", content: "A small botanical atelier. Pressed oils, infused balms, and single-origin tinctures, decanted into amber glass." },
      { property: "og:title", content: "Botanica — Hand-Distilled Apothecary" },
      { property: "og:description", content: "A small botanical atelier. Pressed oils, infused balms, and single-origin tinctures, decanted into amber glass." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Botanica — Hand-Distilled Apothecary" },
      { name: "twitter:description", content: "A small botanical atelier. Pressed oils, infused balms, and single-origin tinctures, decanted into amber glass." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/492143a3-217b-48c2-b080-30c99f547c14" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/492143a3-217b-48c2-b080-30c99f547c14" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Montserrat:wght@300;400;500;600&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <MotionProvider>
        <Nav />
        <main className="min-h-screen">
          <Outlet />
        </main>
        <FooterStage>
          <Footer />
        </FooterStage>
        
        <Toaster position="bottom-right" />
      </MotionProvider>
    </QueryClientProvider>
  );
}
