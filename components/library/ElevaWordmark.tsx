import Image from 'next/image';

// Logomarca oficial Eleva+ (arquivos em public/brand/, processados a partir
// dos PNGs originais fornecidos: fundo removido/tratado como transparência
// real). "light" = texto navy, para fundos claros. "dark" = texto branco,
// para fundos escuros (ex.: sidebar navy, card de login).
const ASSETS = {
  light: '/brand/logo-horizontal-light.png',
  dark: '/brand/logo-horizontal-dark.png',
} as const;

// Proporção nativa dos arquivos horizontais (900x300).
const NATIVE_RATIO = 900 / 300;

const HEIGHT_BY_SIZE = { sm: 22, md: 30, lg: 44 } as const;

export function ElevaWordmark({
  variant = 'light',
  size = 'md',
}: {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}) {
  const height = HEIGHT_BY_SIZE[size];
  const width = Math.round(height * NATIVE_RATIO);

  return (
    <Image
      src={ASSETS[variant]}
      alt="Eleva+"
      width={width}
      height={height}
      priority
      className="select-none"
      style={{ width, height, objectFit: 'contain' }}
    />
  );
}
