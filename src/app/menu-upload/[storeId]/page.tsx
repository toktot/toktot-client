'use client';

import { use, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { AppShell, Header } from '@/widgets/layout';

import { useUploadMenuApi } from '@/features/menu/upload/api/useUploadMenuApi';
import { useMenuImageStore } from '@/features/menu/upload/model/useMenuImageStore';
import { MenuImageUploaderWidget } from '@/features/menu/upload/ui/MenuImageUploaderWidget';
import { BackButton } from '@/features/navigation/back/ui/BackButton';

import { StoreId } from '@/shared/model/types';
import Icon from '@/shared/ui/Icon';

interface MenuUploadPageProps {
	params: Promise<{ storeId: StoreId }>;
}

const MenuUploadPage = ({ params }: MenuUploadPageProps) => {
	const { storeId } = use(params);
	const router = useRouter();
	const { images, isUploading, reset } = useMenuImageStore();
	const { uploadMenuImages } = useUploadMenuApi();

	useEffect(() => {
		return () => {
			reset();
		};
	}, [reset]);

	const handleSubmit = async () => {
		await uploadMenuImages(storeId);

		router.push(`/menu-upload/complete/?storeId=${storeId}`);
	};

	return (
		<AppShell showBottomNav={false}>
			<Header className="bg-white">
				<Header.Left>
					<BackButton />
				</Header.Left>
				<Header.Center>
					<span className="leading-[48px]">메뉴판 등록</span>
				</Header.Center>
			</Header>
			<div className="flex flex-col items-center p-4 gap-9 flex-1">
				<MenuImageUploaderWidget />
				<div className="w-full sticky bottom-4 mt-auto">
					<button
						className="py-3 mx-auto bg-grey-90 text-primary-40 w-full rounded-2xl text-lg font-semibold disabled:bg-grey-50 disabled:text-white disabled:cursor-not-allowed flex justify-center items-center gap-1"
						disabled={isUploading || images.length === 0}
						onClick={handleSubmit}
					>
						<Icon name="Plus" size="s" />
						<span>완료</span>
					</button>
				</div>
			</div>
		</AppShell>
	);
};

export default MenuUploadPage;
