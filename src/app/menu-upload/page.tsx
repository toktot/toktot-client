'use client';

import { useRouter } from 'next/navigation';

import { AppShell, Header } from '@/widgets/layout';

import { BackButton } from '@/features/navigation/back/ui/BackButton';
import { Place } from '@/features/store-search/api/schema';
import { SelectStoreForReview } from '@/features/store-search/ui/SelectStoreForReview';

const SelectStoreForMenuUploadPage = () => {
	const router = useRouter();

	const handleStoreSelect = (store: Place) => {
		router.push(`/menu-upload/${store.id}`);
	};

	return (
		<AppShell showBottomNav={false}>
			<Header className="bg-white">
				<Header.Left>
					<BackButton />
				</Header.Left>
				<Header.Center>메뉴판 등록</Header.Center>
			</Header>
			<SelectStoreForReview onStoreSelect={handleStoreSelect} />
		</AppShell>
	);
};

export default SelectStoreForMenuUploadPage;
