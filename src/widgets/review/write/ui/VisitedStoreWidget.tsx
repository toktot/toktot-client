import { StoreId } from '@/shared/model/types';
import Typography from '@/shared/ui/Typography';

import ReviewStore from '../../read/ui/ReviewStore';

interface VisitedStoreWidgetProps {
	storeId: StoreId;
}

export const VisitedStoreWidget = ({ storeId }: VisitedStoreWidgetProps) => {
	return (
		<section className="w-full space-y-3">
			<Typography as="h3">방문한 가게</Typography>
			<div className="bg-grey-10 text-grey-80 rounded-xl">
				<ReviewStore storeId={storeId} />
			</div>
		</section>
	);
};
