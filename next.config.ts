import type { NextConfig } from 'next';

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
		remotePatterns: [
			{
				protocol: 'https',
				hostname: process.env.NEXT_PUBLIC_IMAGE_HOST!,
			},
		],
	},
};

export default nextConfig;
