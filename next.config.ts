import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    serverExternalPackages: ['formidable', '@paralleldrive/cuid2'],
};

export default nextConfig;