import { bibFontVariables } from '@/lib/library/fonts';

// Aplica as variáveis de fonte (Inter/Manrope) só dentro da rota de login
// administrativo, sem alterar a tipografia global do app principal.
export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <div className={bibFontVariables}>{children}</div>;
}
