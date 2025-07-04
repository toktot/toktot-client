import Icon from '@/widgets/Icon';

import { VisitedStoreData } from '../model/store';

interface VisitedStoreProps {
	store: VisitedStoreData;
}

const VisitedStore = ({ store }: VisitedStoreProps) => {
	return (
		<div className="px-3 py-2 bg-grey-10 rounded-xl flex justify-center items-center text-grey-60">
			<div className="flex justify-center items-center gap-3">
				<img
					className="w-9 h-9 relative rounded"
					src="/images/mockReview.jpg"
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
						<div className="w-0.5 h-0.5 bg-grey-80 rounded-full"></div>
						<div className="justify-cente text-xs">{store.distance}</div>
					</div>
				</div>
				<Icon name={'ArrowRight'} scale={'xs'} />
			</div>
		</div>
	);
};

export default VisitedStore;
