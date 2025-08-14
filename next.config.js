/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental 최적화 설정 제거 (SSR 런타임 오류 방지)
  experimental: {},

  // 웹팩 설정
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // 개발 환경에서 react-refresh 관련 설정
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    // alias는 사용하지 않음 (빌드 아티팩트 충돌 방지)

    return config;
  },

  // 헤더 설정
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
