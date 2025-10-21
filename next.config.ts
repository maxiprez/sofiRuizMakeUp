import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
      serverComponentsExternalPackages: ['formidable', '@paralleldrive/cuid2'],
    }
};

export default nextConfig;