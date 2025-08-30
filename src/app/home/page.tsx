'use client';

import { Suspense } from 'react';

import { HomeAppShell } from '@/widgets/layout/ui/HomeAppShell';

import HomeContainer from '../../features/home/components/HomeContainer';

export default function Home() {
	return (
		<>
			<HomeAppShell showBottomNav={true}>
				<main className="flex-1">
					<Suspense fallback={<div>Loading...</div>}>
						<HomeContainer />
					</Suspense>
				</main>
			</HomeAppShell>
		</>
	);
}
