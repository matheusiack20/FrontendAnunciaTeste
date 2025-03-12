/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Habilita o Next.js para gerar uma versão estática do site
  images: {
    unoptimized: true, // Desativa a otimização de imagens para exportação estática
    domains: ['orgbling.s3.amazonaws.com'], // Permite imagens de um domínio específico
  },
};

module.exports = nextConfig;
