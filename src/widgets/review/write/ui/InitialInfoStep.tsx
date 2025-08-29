'use client';

import {
	RATING_ICON_COLOR_FOR_CATEGORY,
	RATING_ICON_FOR_CATEGORY,
	TooltipCategory,
} from '@/entities/review';

import ReviewFormRenderer, {
	ReviewFormData,
} from '@/features/review/write/ui/ReviewFormRenderer';

import StarRating from '@/shared/ui/StarRating';

interface InitialInfoStepProps {
	category: TooltipCategory;
	rating: number;
	onRatingChange: (rating: number) => void;
	onSubmit: (data: ReviewFormData) => void;
}

const InitialInfoStep = ({
	category,
	rating,
	onRatingChange,
	onSubmit,
}: InitialInfoStepProps) => {
	const color = RATING_ICON_COLOR_FOR_CATEGORY[category];
	const iconName = RATING_ICON_FOR_CATEGORY(category);

	return (
		<div>
			<div className="my-4">
				<ReviewFormRenderer category={category} onSubmit={onSubmit} />
			</div>

			<div className="my-4 flex flex-col items-center">
				<h3 className="text-lg font-semibold mb-2 self-start">별점</h3>
				<StarRating
					value={rating}
					onChange={onRatingChange}
					icon={iconName}
					fillColor={color}
					className="w-full justify-around"
					iconSize="xxl"
				/>
			</div>
		</div>
	);
};

export default InitialInfoStep;
