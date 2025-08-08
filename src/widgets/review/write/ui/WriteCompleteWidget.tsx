import { GoHomeButton } from '@/features/navigation/go-home/ui/GoHomeButton';
import { ViewWrittenReviewButton } from '@/features/review/write/ui/ViewWrittenReviewButton';
import { ReviewId } from '@/shared/model/types';

import Icon from '@/shared/ui/Icon';

interface WriteCompleteWidgetProps {
	newReviewId: ReviewId;
}

export const WriteCompleteWidget = ({
	newReviewId,
}: WriteCompleteWidgetProps) => {
	return (
		<section className="flex flex-col items-center justify-center">
			<div className="flex flex-col items-center justify-center p-8 space-y-4">
				<Icon
					name="Checkmark"
					className="text-white fill-primary-50"
					width={64}
					height={64}
					color={'#3ac8ff'}
				/>
				<h1 className="text-3xl font-semibold">
					리뷰 작성을 <br /> 완료했어요!
				</h1>
			</div>

			<div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
				<ViewWrittenReviewButton reviewId={newReviewId} />
				<GoHomeButton />
			</div>
		</section>
	);
};
