import React from 'react';

import { mockHome } from '../model/mockHome';
import ReviewStoreCard from './ReviewStoreCard';

const StoreReviewList: React.FC = () => {
	return (
		<div className="flex flex-wrap justify-between px-4">
			{mockHome.map((review) => (
				<ReviewStoreCard key={review.id} review={review} />
			))}
		</div>
	);
};
export default StoreReviewList;
