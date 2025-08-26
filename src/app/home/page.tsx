'use client';

import { AppShell } from '@/widgets/layout';

import HomeContainer from '../../features/home/components/HomeContainer';

export default function Home() {
	return (
		<>
			<AppShell showBottomNav={true}>
				<main className="flex-1">
					<HomeContainer />
				</main>
			</AppShell>
		</>
	);
}
