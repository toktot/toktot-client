import Image from 'next/image';

import type { StoreData } from '../model/types';

interface StoreInfoCardProps {
	store: StoreData;
}

export const StoreInfoCard = ({ store }: StoreInfoCardProps) => {
	return (
		<div className="flex justify-center items-center gap-3">
			<div className="relative w-9 h-9 text-center rounded">
				{store.storeImageUrl ? (
					<Image
						src={store.storeImageUrl}
						alt={store.storeName}
						fill
						className="rounded-lg"
					/>
				) : (
					<div className="rounded-lg text-xs text-grey-50 bg-grey-20 p-1 w-full h-full flex items-center justify-center"></div>
				)}
			</div>
			<div className="flex-1 self-stretch inline-flex flex-col justify-between">
				<div className="inline-flex justify-start items-center gap-1.5">
					<div className="justify-center text-sm font-semibold">
						{store.storeName}
					</div>
					<div className="justify-center text-xs">{store.mainMenu}</div>
				</div>
				<div className="inline-flex justify-start items-center gap-1">
					<div className="justify-center text-xs">{store.address}</div>
				</div>
			</div>
		</div>
	);
};
