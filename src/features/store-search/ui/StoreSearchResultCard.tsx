import Image from 'next/image';

import Icon from '@/shared/ui/Icon';

import { PlaceClient } from '../api/schema';

interface StoreSearchResultCardProps {
	store: PlaceClient;
	onSelect: (store: PlaceClient) => void;
}

export const StoreSearchResultCard = ({
	store,
	onSelect,
}: StoreSearchResultCardProps) => {
	return (
		<div
			className="flex items-center p-2 border-b border-grey-10 cursor-pointer hover:bg-grey-5 hover:bg-grey-10"
			onClick={() => onSelect(store)}
		>
			<div className="relative w-22 h-22 mr-4 text-center">
				{store.image ? (
					<Image
						src={store.image}
						alt={store.name}
						fill
						className="rounded-lg"
					/>
				) : (
					<div className="rounded-lg text-xs text-grey-50 bg-grey-20 p-2 w-full h-full flex items-center justify-center">
						등록된 사진이
						<br />
						없어요.
					</div>
				)}
			</div>

			<div className="flex-1">
				<div className="flex items-center gap-1">
					<p className="font-semibold">{store.name}</p>
					<div className="flex items-center text-xs ">
						<Icon
							name="Star"
							size="xxs"
							className="mr-1 text-primary-40 fill-primary-40"
						/>
						<span className="text-grey-90">
							{store.average_rating?.toFixed(1) ?? '-'}
						</span>
						<span className="text-grey-70">({store.review_count ?? 0})</span>
					</div>
				</div>

				<div className="flex items-center text-xs text-grey-70">
					<Icon name="Location" size="xxs" className="mr-1 text-grey-50" />
					<p className="text-xs text-grey-500 mt-1">{store.address}</p>
					<span className="mx-1">·</span>
					<div className="mt-1 text-xs text-grey-80 truncate">
						{store.menus.firstMenu || store.menus.treatMenu}
					</div>
				</div>
			</div>
		</div>
	);
};
