'use client';

import { Suspense } from 'react';

import HomeContainer from '@/widgets/home/ui/HomeContainer';
import { AppShell } from '@/widgets/layout';

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
