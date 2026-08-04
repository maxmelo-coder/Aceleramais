/**
 * Esqueleto específico do leitor (sobrepõe o loading.tsx do detalhe do livro
 * para este segmento) — fundo escuro consistente com o FlipbookViewer, evita
 * um "flash" branco antes do leitor navy aparecer.
 */
export default function BookReaderLoading() {
  return (
    <div className="-mx-4 sm:-mx-6 -my-8">
      <div
        className="min-h-[80vh] flex items-center justify-center bg-[#072441]"
        aria-hidden="true"
      >
        <div className="w-[240px] sm:w-[380px] aspect-[3/4] rounded-lg bg-white/10 motion-safe:animate-pulse" />
      </div>
    </div>
  );
}
