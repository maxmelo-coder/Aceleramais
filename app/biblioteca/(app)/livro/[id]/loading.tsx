export default function BookDetailLoading() {
  return (
    <div className="motion-safe:animate-pulse" aria-hidden="true">
      <div className="h-4 w-32 rounded bg-bib-border-light" />

      <div className="mt-6 grid md:grid-cols-[260px_1fr] gap-8 md:gap-10 items-start">
        <div className="aspect-[3/4] w-full max-w-[260px] rounded-bib-lg bg-bib-border-light mx-auto md:mx-0" />
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="h-5 w-24 rounded-full bg-bib-border-light" />
          <div className="h-7 w-64 max-w-full rounded bg-bib-border-light" />
          <div className="h-4 w-40 rounded bg-bib-border-light" />
          <div className="h-10 w-36 rounded-bib-md bg-bib-border-light mt-2" />
        </div>
      </div>
    </div>
  );
}
