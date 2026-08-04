import { bibFontVariables } from '@/lib/library/fonts';

// Aplica as variáveis de fonte (Inter/Manrope) só dentro da rota de login do
// município, sem alterar a tipografia global do app principal. Mesmo padrão
// usado em app/biblioteca/admin/login/layout.tsx.
export default function MunicipalityLoginLayout({ children }: { children: React.ReactNode }) {
  return <div className={bibFontVariables}>{children}</div>;
}
