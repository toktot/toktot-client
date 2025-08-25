import { GoHomeButton } from '@/features/navigation/go-home/ui/GoHomeButton';
import { ViewWrittenReviewButton } from '@/features/review/write/ui/ViewWrittenReviewButton';

import { ReviewId } from '@/shared/model/types';
import Icon from '@/shared/ui/Icon';
import Typography from '@/shared/ui/Typography';

interface WriteCompleteWidgetProps {
	newReviewId: ReviewId;
}

export const WriteCompleteWidget = ({
	newReviewId,
}: WriteCompleteWidgetProps) => {
	return (
		<>
			<div className="flex flex-col items-center justify-center flex-1 p-8 space-y-4">
				<Icon
					name="Checkmark"
					className="text-white fill-primary-50"
					width={64}
					height={64}
					color={'#3ac8ff'}
				/>
				<Typography as="h1" className="text-[28px]">
					리뷰 작성을 <br /> 완료했어요!
				</Typography>
			</div>

			<div className="flex flex-col gap-4 w-full ">
				<ViewWrittenReviewButton reviewId={newReviewId} />
				<GoHomeButton />
			</div>
		</>
	);
};
