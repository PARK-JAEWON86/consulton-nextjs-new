import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 폰트 최적화 설정
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // 웹팩 설정
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // 개발 환경에서 react-refresh 관련 설정
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  
  // 헤더 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
