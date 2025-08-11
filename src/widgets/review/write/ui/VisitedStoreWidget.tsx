import { type StoreData } from '@/entities/store';

import ReviewStore from '../../read/ui/ReviewStore';

interface VisitedStoreWidgetProps {
	store: StoreData & { distance: number };
}

export const VisitedStoreWidget = ({ store }: VisitedStoreWidgetProps) => {
	return (
		<section className="w-full space-y-3">
			<h2 className="text-lg font-semibold">방문한 가게</h2>
			<div className="bg-grey-10 text-grey-80 rounded-xl">
				<ReviewStore store={store} />
			</div>
		</section>
	);
};
