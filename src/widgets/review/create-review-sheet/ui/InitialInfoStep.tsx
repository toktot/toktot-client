'use client';

import { mapCategoryToIconType } from '@/entities/review/lib/RatingIconType';
import { TooltipCategory } from '@/entities/review/model/tooltip';
import { categoryColors } from '@/entities/review/model/tooltipStyleMap';

import ReviewFormRenderer, {
	type ReviewFormData,
} from '@/features/review/create/ui/ReviewFormRenderer';

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
	const color = categoryColors[category];
	const iconName = mapCategoryToIconType(category);

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
				/>
			</div>
		</div>
	);
};

export default InitialInfoStep;
