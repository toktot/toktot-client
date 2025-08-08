'use client';

import { useRouter } from 'next/navigation';

import Icon from '@/shared/ui/Icon';

export const BackButton = () => {
	const router = useRouter();
	return (
		<button onClick={() => router.back()} aria-label="Go back">
			<Icon name="ArrowLefttBar" />
		</button>
	);
};
