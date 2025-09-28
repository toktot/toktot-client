import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';

import ClientProviders from '@/features/auth/context/ClientProviders';

import PageLoader from '@/shared/components/PageLoader';
import { DevelopmentBanner } from '@/shared/ui/DevelopmentBanner';
import Icon from '@/shared/ui/Icon';

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
				<ClientProviders>
					<PageLoader duration={500} />
					{children}
					<DevelopmentBanner />
					<Toaster
						position="bottom-center"
						reverseOrder={false}
						toastOptions={{
							success: {
								icon: <Icon name="Success" />,
								duration: 1500,
							},
							error: {
								icon: <Icon name="Error" />,
								duration: 1500,
							},
						}}
					/>
				</ClientProviders>
			</body>
		</html>
	);
}
