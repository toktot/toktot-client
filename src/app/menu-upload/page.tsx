'use client';

import { useRouter } from 'next/navigation';

import { AppShell, Header } from '@/widgets/layout';
import { SelectStoreWidget } from '@/widgets/store-search/ui/SelectStoreWidget';

import { BackButton } from '@/features/navigation/ui/back/BackButton';
import { PlaceClient } from '@/features/store-search/api/schema';

import Typography from '@/shared/ui/Typography';

const SelectStoreForMenuUploadPage = () => {
	const router = useRouter();

	const handleStoreSelect = (store: PlaceClient) => {
		router.push(`/menu-upload/${store.id}`);
	};

	return (
		<AppShell showBottomNav={true}>
			<Header className="bg-white">
				<Header.Left>
					<BackButton className="text-grey-70" />
				</Header.Left>
				<Header.Center>메뉴판 등록</Header.Center>
			</Header>
			<div className="p-4 mt-[47px] ">
				<p className="text-grey-70 mb-[12px]">메뉴판 등록을 위한 첫단계예요!</p>
				<Typography as="h1" className="mb-[12px] font-semibold">
					방문한 가게를
					<br />
					검색해주세요
				</Typography>
				<SelectStoreWidget onStoreSelect={handleStoreSelect} />
			</div>
		</AppShell>
	);
};

export default SelectStoreForMenuUploadPage;
