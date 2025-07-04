import Image from 'next/image';

import Icon from '@/widgets/Icon';

import { ReviewImage } from '../model/reviewImage';

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
	return (
		<div
			className="relative w-[100px] h-[100px] shrink-0"
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
			{showTooltipCount && image.tooltips.length > 0 && (
				<div className="absolute bottom-1 left-1 bg-primary text-white text-xs rounded px-1 py-0.5">
					툴팁 {image.tooltips.length}
				</div>
			)}
		</div>
	);
};
