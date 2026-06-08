export function Footer() {
  return (
    <footer className="px-6 md:px-12 pt-32 pb-12 bg-background border-t border-border">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 max-w-7xl mx-auto">
        <div className="md:col-span-4 font-serif italic text-4xl leading-tight">
          Distilled from earth, by hand.
        </div>

        <div className="md:col-span-4 grid grid-cols-2 gap-12">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Explore</span>
            <a href="#" className="text-xs hover:text-accent transition-colors">Collections</a>
            <a href="#" className="text-xs hover:text-accent transition-colors">The Lab</a>
            <a href="#" className="text-xs hover:text-accent transition-colors">Stockists</a>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Support</span>
            <a href="#" className="text-xs hover:text-accent transition-colors">Sustainability</a>
            <a href="#" className="text-xs hover:text-accent transition-colors">Shipping</a>
            <a href="#" className="text-xs hover:text-accent transition-colors">Contact</a>
          </div>
        </div>
        <div className="md:col-span-4">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Subscribe to the lab notes
          </p>
          <form className="border-b border-foreground/20 pb-3 flex justify-between items-center group" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email address"
              className="bg-transparent text-xs flex-1 outline-none placeholder:text-muted-foreground"
            />
            <button className="text-xs group-hover:translate-x-1 transition-transform" aria-label="Subscribe">→</button>
          </form>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 flex justify-between items-end text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
        <span>© {new Date().getFullYear()} Botanica Atelier</span>
        <span>Hand-distilled, small batch</span>
      </div>

    </footer>
  );
}
