export function SafetyBanner() {
  return (
    <div className="flex items-start gap-3 px-4 py-3 bg-bib-teal/5 border border-bib-teal/20 rounded-bib-md text-xs text-bib-text-light-secondary">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#009CA4" strokeWidth="2" className="shrink-0 mt-0.5" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
      <p>
        <strong className="text-bib-teal">IA Eleva+</strong> oferece apoio pedagógico.
        Suas sugestões precisam ser analisadas e validadas pelos profissionais responsáveis.
        Ela não realiza diagnósticos nem substitui o diálogo com o estudante, a família, a equipe pedagógica, o AEE ou a rede de proteção.
      </p>
    </div>
  );
}
