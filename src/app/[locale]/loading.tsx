export default function Loading() {
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <div className="fixed inset-x-0 top-0 z-50 border-b border-line bg-background/78 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
          <div className="h-8 w-32 animate-pulse rounded-md bg-muted/20" />
          <div className="hidden items-center gap-7 md:flex">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                className="h-3 w-16 animate-pulse rounded-full bg-muted/20"
                key={index}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="h-11 w-16 animate-pulse rounded-full bg-muted/20" />
            <div className="size-11 animate-pulse rounded-full bg-muted/20" />
          </div>
        </div>
      </div>

      <section className="relative flex min-h-screen items-end bg-foreground pt-28 text-background">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,5,3,.88),rgba(6,5,3,.42),rgba(6,5,3,.18))]" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-5 pb-12 md:grid-cols-[1.05fr_.95fr] md:gap-10 md:px-8 md:pb-24">
          <div className="max-w-3xl">
            <div className="mb-5 h-9 w-48 animate-pulse rounded-full bg-background/12" />
            <div className="space-y-4">
              <div className="h-14 w-full max-w-2xl animate-pulse rounded-md bg-background/16 md:h-20" />
              <div className="h-14 w-4/5 animate-pulse rounded-md bg-background/16 md:h-20" />
            </div>
            <div className="mt-7 space-y-3">
              <div className="h-4 w-full max-w-xl animate-pulse rounded-full bg-background/14" />
              <div className="h-4 w-5/6 animate-pulse rounded-full bg-background/14" />
            </div>
            <div className="mt-8 flex gap-3">
              <div className="h-13 w-36 animate-pulse rounded-md bg-accent/70" />
              <div className="h-13 w-32 animate-pulse rounded-md border border-background/20 bg-background/10" />
            </div>
          </div>
          <div className="self-end border-l border-background/20 pl-6">
            <div className="grid grid-cols-2 gap-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index}>
                  <div className="h-10 w-20 animate-pulse rounded-md bg-background/16" />
                  <div className="mt-3 h-3 w-24 animate-pulse rounded-full bg-background/12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
