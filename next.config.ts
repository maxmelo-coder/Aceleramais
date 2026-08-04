import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pacote nativo (bindings .node) usado na conversão de PDF em página do servidor —
  // não pode ser processado pelo bundler, precisa rodar como dependência externa do runtime Node.
  serverExternalPackages: ["@napi-rs/canvas"],
};

export default nextConfig;
