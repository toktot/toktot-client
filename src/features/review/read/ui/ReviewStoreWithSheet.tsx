import { useState } from 'react';

import { ReviewView } from '@/entities/review';

import { ReviewTooltipSheet } from '@/widgets/review/read/ui/ReviewTooltipSheet';

import Icon from '@/shared/ui/Icon';

export function ReviewStoreWithSheet({ review }: { review: ReviewView }) {
	const [open, setOpen] = useState(false);

	return (
		<div className="w-full px-2 py-2 rounded-xl bg-grey-90 text-sm">
			<button
				onClick={() => setOpen(true)}
				className="flex items-center justify-between w-full"
			>
				이 가게의
				<br /> 전체 리뷰
				<Icon name={'ArrowRight'} size={'xs'} />
			</button>
			<ReviewTooltipSheet open={open} onOpenChange={setOpen} review={review} />
		</div>
	);
}
