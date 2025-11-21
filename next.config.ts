import type { NextConfig } from "next";

// Build S3 hostname patterns from environment variables
const getS3ImageConfig = () => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  const region = process.env.AWS_S3_REGION;
  
  const patterns: Array<{
    protocol: 'https';
    hostname: string;
    pathname: string;
  }> = [
    // Generic S3 patterns (fallback)
    {
      protocol: 'https',
      hostname: '*.s3.amazonaws.com',
      pathname: '/**',
    },
  ];

  // Add specific hostname if bucket and region are configured
  if (bucketName && region) {
    patterns.unshift({
      protocol: 'https',
      hostname: `${bucketName}.s3.${region}.amazonaws.com`,
      pathname: '/**',
    });
  }

  return patterns;
};

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configure allowed image domains for Next.js Image component
  images: {
    remotePatterns: getS3ImageConfig(),
  },
  // Optimize for Vercel deployment
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Reduce memory usage during build and improve chunking
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              maxSize: 200000,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true,
            },
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
