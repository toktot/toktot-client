import { type StoreData } from '@/entities/store';

import Typography from '@/shared/ui/Typography';

import ReviewStore from '../../read/ui/ReviewStore';

interface VisitedStoreWidgetProps {
	store: StoreData & { distance: number };
}

export const VisitedStoreWidget = ({ store }: VisitedStoreWidgetProps) => {
	return (
		<section className="w-full space-y-3">
			<Typography as="h3">방문한 가게</Typography>
			<div className="bg-grey-10 text-grey-80 rounded-xl">
				<ReviewStore store={store} />
			</div>
		</section>
	);
};
