import { StoreData, StoreInfoCard } from '@/entities/store';

// import Link from 'next/link';

import { StoreExtraInfo } from '@/features/review/read/model/types';

import Icon from '@/shared/ui/Icon';

interface ReviewStoreInfoProps {
	store: StoreData;
	extra?: StoreExtraInfo;
}

const ReviewStore = ({ store, extra }: ReviewStoreInfoProps) => {
	return (
		// <Link
		// 	href={`/store/${store.id}`}
		// 	aria-label={`${store.storeName} 상세 보기`}
		// >
		<div className="px-3 py-2 flex justify-between items-center rounded-xl">
			<StoreInfoCard store={store} />
			{extra?.distance && <span className="text-sm">{extra.distance}m</span>}
			<Icon name={'ArrowRight'} size={'xs'} />
		</div>
		// </Link>
	);
};

export default ReviewStore;
