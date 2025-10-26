'use client';

import { useRouter } from 'next/navigation';

import Icon from '@/shared/ui/Icon';

export const BackButton = ({ className }: { className?: string }) => {
	const router = useRouter();
	return (
		<button
			onClick={() => router.back()}
			aria-label="Go back"
			className={className}
		>
			<Icon name="ArrowLeftBar" />
		</button>
	);
};
