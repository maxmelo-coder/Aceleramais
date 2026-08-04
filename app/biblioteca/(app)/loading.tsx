/**
 * Esqueleto de carregamento da página inicial da biblioteca — evita "salto"
 * de layout enquanto os dados (programas, livros, histórico) são buscados no
 * servidor. `motion-safe:` respeita prefers-reduced-motion automaticamente
 * (sem JS: quem prefere menos movimento vê o esqueleto estático).
 */
export default function LibraryHomeLoading() {
  return (
    <div className="space-y-12 motion-safe:animate-pulse" aria-hidden="true">
      <div className="h-48 sm:h-56 rounded-bib-xl bg-bib-border-light" />

      <div>
        <div className="h-5 w-40 rounded bg-bib-border-light" />
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[3/4] rounded-bib-md bg-bib-border-light" />
              <div className="mt-2.5 h-3.5 w-3/4 rounded bg-bib-border-light" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
