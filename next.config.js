/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  images: {
    domains: ['qosnfemixppvsdgigppu.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  allowedDevOrigins: [
    "preview-chat-0a1b7fd1-f67b-49da-b4cf-d7149e92cd55.space.z.ai",
  ],
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
