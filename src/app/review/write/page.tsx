'use client';

import { useRouter } from 'next/navigation';

import { Place } from '@/features/store-search/api/schema';
import { SelectStoreForReview } from '@/features/store-search/ui/SelectStoreForReview';

export default function Page() {
	const router = useRouter();

	const handleStoreSelect = (store: Place) => {
		router.push(`/review/write/${store.id}`);
	};

	return <SelectStoreForReview onStoreSelect={handleStoreSelect} />;
}
