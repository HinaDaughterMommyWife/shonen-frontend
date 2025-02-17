import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "p27kfbb298.ufs.sh",
        port: "",
        pathname: "/f/**",
      },
    ]
  }/* ,
  async headers() {
    return [
      {
        source: "/emote-data.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, immutable", // Cache por 24 horas
          },
        ]
      }
    ]
  }, */
};

export default nextConfig;
