import Image from 'next/image';

import Icon from '@/shared/ui/Icon';

import type { StoreData } from '../model/types';

interface StoreInfoCardProps {
	store: StoreData;
}

export const StoreInfoCard = ({ store }: StoreInfoCardProps) => {
	return (
		<div className="flex justify-center items-center gap-3 overflow-hidden">
			<div className="relative w-9 h-9 text-center rounded flex-shrink-0">
				{store.storeImageUrl ? (
					<Image
						src={store.storeImageUrl}
						alt={store.storeName}
						fill
						className="rounded-lg"
					/>
				) : (
					<div className="rounded-lg text-[5px] text-grey-50 bg-grey-20 p-1 w-full h-full flex items-center justify-center">
						<Icon size="s" name={'KoreanDish'} />
					</div>
				)}
			</div>
			<div className="flex-1 self-stretch inline-flex flex-col justify-between min-w-0">
				<div className="inline-flex justify-start items-center gap-1.5 min-w-0">
					<div className="justify-center text-sm font-semibold truncate">
						{store.storeName}
					</div>
					<div className="justify-center text-xs flex-shrink-0 truncate">
						{store.mainMenu}
					</div>
				</div>
				<div className="flex items-center gap-1 min-w-0 overflow-hidden">
					<span className="text-xs truncate">{store.address}</span>
				</div>
			</div>
		</div>
	);
};
