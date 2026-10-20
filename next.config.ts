import type { NextConfig } from "next";

const rawBackend =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_INTERNAL_URL ||
  "http://localhost:5000/api/v1";
const backendBase = rawBackend.replace(/\/api\/v1\/?$/, "");

const nextConfig: NextConfig = {
  reactCompiler: true,
  env: {
    BACKEND_INTERNAL_URL: rawBackend,
    NEXT_PUBLIC_BACKEND_INTERNAL_URL: rawBackend,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendBase}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
