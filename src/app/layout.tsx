import type { Metadata } from 'next';

import ClientProviders from '@/features/auth/context/ClientProviders';

import { manrope, pretendard } from './font/font';
import './globals.css';

export const metadata: Metadata = {
	title: 'toktot',
	description: '제주 여행을 즐겁게',
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
