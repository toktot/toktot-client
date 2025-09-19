'use client';

import { useRouter } from 'next/navigation';

import { AppShell, Header } from '@/widgets/layout';

import { BackButton } from '@/features/navigation/back/ui/BackButton';
import { Place } from '@/features/store-search/api/schema';
import { SelectStoreForReview } from '@/features/store-search/ui/SelectStoreForReview';

const SelectStoreForReviewPage = () => {
	const router = useRouter();

	const handleStoreSelect = (store: Place) => {
		router.push(`/review/write/${store.id}`);
	};

	return (
		<AppShell showBottomNav={false}>
			<Header className="bg-white">
				<Header.Left>
					<BackButton className="text-grey-70" />
				</Header.Left>
				<Header.Center>리뷰 쓰기</Header.Center>
			</Header>
			<SelectStoreForReview onStoreSelect={handleStoreSelect} />
		</AppShell>
	);
};

export default SelectStoreForReviewPage;
