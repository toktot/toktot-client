import Image from 'next/image';

import Icon from '@/shared/ui/Icon';

import { Place } from '../api/schema';

interface StoreSearchResultCardProps {
	store: Place;
	onSelect: (store: Place) => void;
}

export const StoreSearchResultCard = ({
	store,
	onSelect,
}: StoreSearchResultCardProps) => {
	return (
		<div
			className="flex items-center p-2 border-b border-grey-10 cursor-pointer hover:bg-grey-5"
			onClick={() => onSelect(store)}
		>
			<Image
				src={store.image || '/images/default-store.png'}
				alt={store.name}
				width={60}
				height={60}
				className="rounded-lg mr-4"
			/>
			<div className="flex-1">
				<p className="font-semibold">{store.name}</p>
				<div className="flex items-center text-xs text-grey-60">
					<Icon name="Star" size="xxs" className="mr-1 text-yellow-400" />
					<span>{store.average_rating?.toFixed(1) ?? '-'}</span>
					<span className="mx-1">·</span>
					<span>리뷰 {store.review_count ?? 0}</span>
				</div>
				<p className="text-xs text-grey-500 mt-1">{store.address}</p>
			</div>
		</div>
	);
};
