import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'toktot',
		short_name: 'toktot',
		description: '제주 여행을 즐겁게',
		start_url: '/',
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#000000',
		icons: [
			{
				src: '/next.svg',
				sizes: '192x192',
				type: 'image/svg',
			},
			{
				src: '/vercel.svg',
				sizes: '512x512',
				type: 'image/svg',
			},
		],
	};
}
