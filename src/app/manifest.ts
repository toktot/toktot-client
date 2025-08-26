import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: '똑똣',
		short_name: '똑똣',
		description: '제주 맛집, 가격과 리뷰로 똑똑하게 고르다',
		start_url: '/',
		display: 'standalone',
		background_color: '#F2FAFE',
		theme_color: '#000000',
		icons: [
			{
				src: '/icon/192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: '/icon/512.png',
				sizes: '512x512',
				type: 'image/png',
			},
		],
	};
}
