import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

function buildApiImagePattern() {
  try {
    const url = new URL(apiUrl);
    return {
      protocol: url.protocol === "https:" ? "https" : "http",
      hostname: url.hostname,
      port: url.port || undefined,
      pathname: "/uploads/**",
    } as const;
  } catch {
    return {
      protocol: "http" as const,
      hostname: "localhost",
      port: "4000",
      pathname: "/uploads/**",
    };
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    root: process.cwd(),
  },
  async rewrites() {
    // El navegador habla con el mismo origen (web) y Next hace de proxy hacia
    // el API. En Docker el API se llama `api`; en local, `localhost`.
    const apiInternalUrl =
      process.env.API_INTERNAL_URL ?? "http://localhost:4000";

    return [
      {
        source: "/api/:path*",
        destination: `${apiInternalUrl}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${apiInternalUrl}/uploads/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      buildApiImagePattern(),
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "4000",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
