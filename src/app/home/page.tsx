'use client';

import { Suspense } from 'react';

import { AppShell } from '@/widgets/layout';

import HomeContainer from '../../features/home/components/HomeContainer';

export default function Home() {
	return (
		<>
			<AppShell showBottomNav={true}>
				<main className="flex-1">
					<Suspense fallback={<div>Loading...</div>}>
						<HomeContainer />
					</Suspense>
				</main>
			</AppShell>
		</>
	);
}
