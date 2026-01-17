'use client';

import { useRouter } from 'next/navigation';

import { AppShell, Header } from '@/widgets/layout';
import { SelectStoreWidget } from '@/widgets/store-search/ui/SelectStoreWidget';

import { BackButton } from '@/features/navigation/ui/back/BackButton';
import { PlaceClient } from '@/features/store-search/api/schema';

import Typography from '@/shared/ui/Typography';

const SelectStoreForReviewPage = () => {
	const router = useRouter();

	const handleStoreSelect = (store: PlaceClient) => {
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
			<div className="p-4">
				<Typography as="h1" className="mt-[47px] mb-[12px] font-semibold">
					방문한 가게를
					<br />
					검색해주세요
				</Typography>
				<SelectStoreWidget onStoreSelect={handleStoreSelect} />
			</div>
		</AppShell>
	);
};

export default SelectStoreForReviewPage;
