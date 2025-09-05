'use client';

import { type StoreData } from '@/entities/store';
import { StoreInfoCard } from '@/entities/store';

// import Link from 'next/link';

import { StoreExtraInfo } from '@/features/review/read/model/types';
import { useStore } from '@/features/review/write/hooks/useStore';

import { StoreId } from '@/shared/model/types';
import Icon from '@/shared/ui/Icon';

interface ReviewStoreInfoProps {
	storeId: StoreId;
	extra?: StoreExtraInfo;
}

const ReviewStore = ({ storeId, extra }: ReviewStoreInfoProps) => {
	const { store, isLoading, error } = useStore(storeId);

	if (isLoading) {
		return <div className="p-4">가게 정보를 불러오는 중...</div>;
	}

	if (error) {
		return <div className="p-4 text-red-500">오류: {error}</div>;
	}

	if (!store) {
		return <div className="p-4">가게 정보를 찾을 수 없습니다.</div>;
	}

	const storeDataForDisplay: StoreData & { distance: number } = {
		id: store.id as StoreId,
		storeName: store.storeName,
		address: store.address,
		storeImageUrl: store.storeImageUrl || '',
		mainMenu: store.mainMenu,
		distance: 0,
	};

	return (
		// <Link
		// 	href={`/store/${store.id}`}
		// 	aria-label={`${store.storeName} 상세 보기`}
		// >
		<div className="px-3 py-2 flex justify-between items-center rounded-xl ">
			<StoreInfoCard store={storeDataForDisplay} />
			{extra?.distance && <span className="text-sm">{extra.distance}m</span>}
			<Icon name={'ArrowRight'} size={'xs'} />
		</div>
		// </Link>
	);
};

export default ReviewStore;
