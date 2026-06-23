export default function GalleryLoading() {
  return (
    <main className="isolate min-h-dvh bg-background">
      <div className="border-b border-line px-5 py-5 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="h-8 w-28 rounded-md bg-surface" />
          <div className="h-10 w-36 rounded-full bg-surface" />
        </div>
      </div>
      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="h-4 w-32 rounded-full bg-surface" />
          <div className="mt-6 h-16 max-w-2xl rounded-md bg-surface" />
          <div className="mt-5 h-7 max-w-3xl rounded-md bg-surface" />
        </div>
      </section>
      <div className="border-y border-line px-5 py-3 md:px-8">
        <div className="mx-auto flex max-w-7xl gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="h-11 w-28 rounded-full bg-surface" key={index} />
          ))}
        </div>
      </div>
      <section className="px-5 py-10 md:px-8 md:py-14">
        <div className="mx-auto grid max-w-7xl auto-rows-[220px] gap-4 sm:grid-cols-2 md:auto-rows-[260px] lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="rounded-md bg-surface" key={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
