import { ReviewImage } from '../model/reviewImage';

interface Props {
	image: ReviewImage;
	showTooltipCount?: boolean;
}

export const ReviewImageItem = ({ image, showTooltipCount = true }: Props) => {
	return (
		<div className="relative w-[100px] h-[100px] shrink-0">
			<img
				src={image.url}
				alt="리뷰 이미지"
				className="w-full h-full object-cover rounded"
			/>
			{showTooltipCount && image.tooltips.length > 0 && (
				<div className="absolute bottom-1 left-1 bg-primary text-white text-xs rounded px-1 py-0.5">
					툴팁 {image.tooltips.length}
				</div>
			)}
		</div>
	);
};
