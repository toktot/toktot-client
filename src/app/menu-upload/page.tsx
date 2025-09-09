'use client';

import { useRouter } from 'next/navigation';

import { Place } from '@/features/store-search/api/schema';
import { SelectStoreForReview } from '@/features/store-search/ui/SelectStoreForReview';

const SelectStoreForMenuUploadPage = () => {
	const router = useRouter();

	const handleStoreSelect = (store: Place) => {
		router.push(`/menu-upload/${store.id}`);
	};

	return <SelectStoreForReview onStoreSelect={handleStoreSelect} />;
};

export default SelectStoreForMenuUploadPage;