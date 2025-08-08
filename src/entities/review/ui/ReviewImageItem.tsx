import Image from 'next/image';

import Icon from '@/shared/ui/Icon';

import { ReviewImage } from '../model/image';

interface Props {
	image: ReviewImage;
	showTooltipCount?: boolean;
	onSelectImage: (image: ReviewImage) => void;
	onDeleteImage?: () => void;
}

export const ReviewImageItem = ({
	image,
	showTooltipCount = true,
	onSelectImage,
	onDeleteImage,
}: Props) => {
	const tooltipCount = image.tooltipIds.length;

	return (
		<div
			className="relative w-9 rounded-xl"
			onClick={() => onSelectImage(image)}
		>
			<Image src={image.url} alt="리뷰 이미지" fill />
			{onDeleteImage && (
				<button
					className="absolute top-1 right-1 z-10"
					onClick={(e) => {
						e.stopPropagation();
						onDeleteImage();
					}}
				>
					<Icon name="Cancel" size="s" />
				</button>
			)}
			{showTooltipCount && tooltipCount > 0 && (
				<div className="absolute bottom-1 right-1 bg-primary text-primary-50 text-xs px-1 py-0.5 rounded-full bg-grey-10">
					{tooltipCount}
				</div>
			)}
		</div>
	);
};
