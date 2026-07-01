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
      { title: "Aetheria — The New Geometry of Beauty" },
      { name: "description", content: "Aetheria — a 3D cosmetics laboratory. Sculptural lipstick, foundation, skincare, and fragrance, explored in three dimensions." },
      { property: "og:title", content: "Aetheria — The New Geometry of Beauty" },
      { property: "og:description", content: "Aetheria — a 3D cosmetics laboratory. Sculptural lipstick, foundation, skincare, and fragrance, explored in three dimensions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Aetheria — The New Geometry of Beauty" },
      { name: "twitter:description", content: "Aetheria — a 3D cosmetics laboratory. Sculptural lipstick, foundation, skincare, and fragrance, explored in three dimensions." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d5aac88e-2b7e-41e6-813a-f614cf6af3b4/id-preview-dfa8a77d--19b9c183-0fc4-4757-8a0d-e74f4346dcc4.lovable.app-1780761798503.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d5aac88e-2b7e-41e6-813a-f614cf6af3b4/id-preview-dfa8a77d--19b9c183-0fc4-4757-8a0d-e74f4346dcc4.lovable.app-1780761798503.png" },
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
