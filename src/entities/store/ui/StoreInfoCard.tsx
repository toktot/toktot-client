import type { StoreData } from '../model/types';

interface StoreInfoCardProps {
	store: StoreData;
}

export const StoreInfoCard = ({ store }: StoreInfoCardProps) => {
	return (
		<div className="flex justify-center items-center gap-3">
			<img
				className="w-9 h-9 relative rounded"
				// FIXME: 기본 이미지 교체
				src={store.storeImageUrl || '/images/default-store.png'}
				alt={store.storeName}
			/>
			<div className="w-60 self-stretch inline-flex flex-col justify-between">
				<div className="inline-flex justify-start items-center gap-1.5">
					<div className="justify-center text-grey-80 text-sm font-semibold">
						{store.storeName}
					</div>
					<div className="justify-center text-grey-80 text-xs">
						{store.mainMenu}
					</div>
				</div>
				<div className="inline-flex justify-start items-center gap-1">
					<div className="justify-center text-xs">{store.address}</div>
				</div>
			</div>
		</div>
	);
};
