import type { NextConfig } from "next";

function getApiRewriteDestination() {
  const raw =
    process.env.NEXT_PUBLIC_API_URL ?? "https://quickcred-api.onrender.com/api";
  const normalized = raw.replace(/\/+$/, "");
  return normalized.endsWith("/api")
    ? `${normalized}/:path*`
    : `${normalized}/api/:path*`;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: getApiRewriteDestination(),
      },
    ];
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
};

export default nextConfig;
