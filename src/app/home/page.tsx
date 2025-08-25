'use client';

import { AppShell } from '@/widgets/layout';

import HomeContainer from '../../features/home/components/HomeContainer';

export default function Home() {
	return (
		<>
			<AppShell showBottomNav={true}>
				<HomeContainer />
			</AppShell>
		</>
	);
}
