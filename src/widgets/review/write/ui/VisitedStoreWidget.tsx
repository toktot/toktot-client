import { type StoreData, StoreInfoCard } from '@/entities/store';

import Icon from '@/shared/ui/Icon';

interface VisitedStoreWidgetProps {
	store: StoreData & { distance: number };
}

export const VisitedStoreWidget = ({ store }: VisitedStoreWidgetProps) => {
	return (
		<section className="w-full space-y-3">
			<h2 className="text-lg font-semibold">방문한 가게</h2>
			<div className="px-3 py-2 bg-grey-10 rounded-xl flex justify-between items-center text-grey-60">
				<StoreInfoCard store={store} />

				{/* 거리 표시 */}
				<div className="flex items-center gap-2">
					<div className="w-0.5 h-0.5 bg-grey-80 rounded-full" />
					<div className="justify-center text-xs">{store.distance}m</div>
				</div>

				<Icon name={'ArrowRight'} size={'xs'} />
			</div>
		</section>
	);
};
