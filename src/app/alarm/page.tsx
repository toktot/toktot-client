import { Suspense } from 'react';

import { AppShell } from '@/widgets/layout';

import AlarmTotal from '@/features/alarm/components/AlarmTotal';


export default function Alarm() {
	return (
		<AppShell showBottomNav={true}>
			<Suspense fallback={<div>Loading...</div>}>
				<AlarmTotal />
			</Suspense>
		</AppShell>
	);
}
