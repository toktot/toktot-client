'use client';

import { useParams } from 'next/navigation';

import { AppShell, Header } from '@/widgets/layout';
import { ReviewSubmitButton } from '@/widgets/review/write/ui/ReviewSubmitButton';

import { BackButton } from '@/features/navigation/back/ui/BackButton';
import { ValueScoreInput } from '@/features/review/write/ui/ValueScoreInput';

export default function ValueScorePage() {
	const params = useParams();
	const restaurantId = Number(params.storeId);

	return (
		<AppShell showBottomNav={false}>
			<Header>
				<Header.Left>
					<BackButton />
				</Header.Left>
				<Header.Center>리뷰 쓰기</Header.Center>
			</Header>
			<div className="flex flex-col items-center justify-between flex-1 p-4">
				<ValueScoreInput />
				<div className="w-full p-4">
					<ReviewSubmitButton restaurantId={restaurantId} />
				</div>
			</div>
		</AppShell>
	);
}
