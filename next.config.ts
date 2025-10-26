// next.config.ts
import type { NextConfig } from 'next'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // public/manifest.json 사용
})

// 공통 이미지 원격 패턴
const remotePatterns: NonNullable<NextConfig['images']>['remotePatterns'] = [
  // ✅ 오류 발생 호스트 추가
  { protocol: 'https', hostname: 'lh3.googleusercontent.com' },

  // 네이버(검색/플레이스 원본)
  { protocol: 'https', hostname: 'search.pstatic.net' },
  { protocol: 'https', hostname: 'ldb-phinf.pstatic.net' },

  // 관광/카카오 CDN (HTTPS 권장)
  { protocol: 'https', hostname: 'tong.visitkorea.or.kr' },
  { protocol: 'https', hostname: 'img1.kakaocdn.net' },
  { protocol: 'https', hostname: 't1.kakaocdn.net' },
  { protocol: 'https', hostname: 'k.kakaocdn.net' },
]

// 환경변수 기반 호스트가 있다면 추가
if (process.env.NEXT_PUBLIC_IMAGE_HOST) {
  remotePatterns.push({
    protocol: 'https',
    hostname: process.env.NEXT_PUBLIC_IMAGE_HOST!,
  })
}

const nextConfig: NextConfig = {
  reactStrictMode: true,

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [
                { name: 'removeDimensions', active: true },
                { name: 'removeViewBox', active: false },
              ],
            },
          },
        },
      ],
    })
    return config
  },

  compiler: {
    styledComponents: true,
  },

  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  /**
   * https://nextjs.org/docs/messages/next-image-unconfigured-host
   */
  images: {
    // (선택) 구방식 domains도 함께 유지 가능
    domains: [
      'tong.visitkorea.or.kr',
      't1.kakaocdn.net',
      'img1.kakaocdn.net',
      'lh3.googleusercontent.com', // ✅ 추가
      'k.kakaocdn.net',
      'img1.kakaocdn.net',
    ],
    remotePatterns,
    // next export 사용 시:
    // unoptimized: true,
  },

  // manifest.json 접근 보장
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
        ],
      },
    ]
  },
}

export default withPWA(nextConfig)
