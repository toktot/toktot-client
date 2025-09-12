import type { NextConfig } from 'next';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require('next-pwa')({
	dest: 'public',
	register: true,
	skipWaiting: true,
	disable: process.env.NODE_ENV === 'development',
	// manifest 설정을 제거하고 public/manifest.json 파일을 사용
});

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
								{
									name: 'removeDimensions',
									active: true,
								},
								{
									name: 'removeViewBox',
									active: false,
								},
							],
						},
					},
				},
			],
		});

		return config;
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
	 *
	 * https://nextjs.org/docs/messages/next-image-unconfigured-host
	 */
	images: {
		domains: ['tong.visitkorea.or.kr', 't1.kakaocdn.net', 'img1.kakaocdn.net'],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: process.env.NEXT_PUBLIC_IMAGE_HOST!,
			},
			{
				protocol: 'http',
				hostname: 'tong.visitkorea.or.kr',
			},
			{
				protocol: 'http',
				hostname: 'img1.kakaocdn.net',
			},
			{
				protocol: 'http',
				hostname: 'k.kakaocdn.net',
			},
		],
	},
	// 헤더 설정 추가로 manifest.json 접근 보장
	async headers() {
		return [
			{
				source: '/manifest.json',
				headers: [
					{
						key: 'Content-Type',
						value: 'application/json',
					},
				],
			},
		];
	},
};

export default withPWA(nextConfig);
