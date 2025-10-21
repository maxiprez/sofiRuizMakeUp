import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    transpilePackages: ['@getbrevo/brevo', 'formidable', '@paralleldrive/cuid2'],
};

export default nextConfig;
