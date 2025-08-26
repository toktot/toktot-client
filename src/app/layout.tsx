import type { Metadata } from 'next';

import ClientProviders from '@/features/auth/context/ClientProviders';

import { manrope, pretendard } from './font/font';
import './globals.css';

export const metadata: Metadata = {
	title: '똑똣',
	description: '제주 맛집, 가격과 리뷰로 똑똑하게 고르다',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko">
			<body
				className={`${pretendard.variable} ${manrope.variable} antialiased`}
			>
				<ClientProviders>{children}</ClientProviders>
			</body>
		</html>
	);
}
