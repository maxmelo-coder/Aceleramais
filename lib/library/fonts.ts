import { Inter, Manrope } from 'next/font/google';

// Tipografia premium isolada da área administrativa da Biblioteca Digital.
// Não afeta o app principal (Acelera+), que continua usando a fonte do
// sistema definida em app/globals.css. Aplicar `bibFontVariables` na raiz
// do layout da Biblioteca para disponibilizar --font-bib-inter e
// --font-bib-manrope, consumidas pelos tokens --font-bib-sans/--font-bib-display
// em app/biblioteca/admin/admin-theme.css.
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-bib-inter',
  display: 'swap',
});

export const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-bib-manrope',
  display: 'swap',
});

export const bibFontVariables = `${inter.variable} ${manrope.variable}`;
