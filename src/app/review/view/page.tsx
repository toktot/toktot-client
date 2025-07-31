import React from 'react';

import { ReviewStoryFeed } from '@/widgets/review/read/ui/ReviewStoryFeed';

const page = () => {
	return (
		<div className="h-dvh flex flex-col items-center p-4 gap-9 bg-grey-90">
			<ReviewStoryFeed />
		</div>
	);
};

export default page;
