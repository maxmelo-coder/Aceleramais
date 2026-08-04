export default function ProgramLoading() {
  return (
    <div className="motion-safe:animate-pulse" aria-hidden="true">
      <div className="h-4 w-40 rounded bg-bib-border-light" />

      <div className="mt-4 flex items-center gap-3">
        <div className="w-3 h-10 rounded-full bg-bib-border-light shrink-0" />
        <div>
          <div className="h-6 w-56 rounded bg-bib-border-light" />
          <div className="mt-2 h-3.5 w-72 rounded bg-bib-border-light" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[3/4] rounded-bib-md bg-bib-border-light" />
            <div className="mt-2.5 h-3.5 w-3/4 rounded bg-bib-border-light" />
          </div>
        ))}
      </div>
    </div>
  );
}
