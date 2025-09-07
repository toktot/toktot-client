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
		return (
			<div className="px-3 py-2 flex justify-between items-center rounded-xl">
				<div className="flex justify-center items-center gap-3 overflow-hidden">
					<div className="relative w-9 h-9 text-center rounded flex-shrink-0">
						<div className="rounded-lg text-[5px] text-grey-50 bg-grey-20 p-1 w-full h-full flex items-center justify-center"></div>
					</div>
					<div className="flex-1 self-stretch inline-flex flex-col justify-between min-w-0">
						<div className="inline-flex justify-start items-center gap-1.5 min-w-0">
							<div className="justify-center text-sm font-semibold truncate"></div>
							<div className="justify-center text-xs flex-shrink-0 truncate"></div>
						</div>
						<div className="flex items-center gap-1 min-w-0 overflow-hidden"></div>
					</div>
				</div>
			</div>
		);
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
