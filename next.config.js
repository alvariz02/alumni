/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "preview-chat-0a1b7fd1-f67b-49da-b4cf-d7149e92cd55.space.z.ai",
  ],
};

export default nextConfig;
