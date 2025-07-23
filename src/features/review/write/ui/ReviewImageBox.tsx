import { ReviewImage } from '@/entities/review';
import Image from 'next/image';

interface ReviewImageBoxProps {
	image: ReviewImage;
	onClick?: () => void;
}

export const ReviewImageBox = ({ image, onClick }: ReviewImageBoxProps) => {
	const tooltipCount = image.tooltipIds.length;

	return (
		<div
			onClick={onClick}
			className="w-[100px] h-[100px] bg-grey-10 flex items-center justify-center rounded-xl flex-shrink-0 relative cursor-pointer"
		>
			<Image src={image.url} alt="리뷰 이미지" fill className="object-cover" />
			<div className="absolute bottom-1 right-1 text-primary-50 text-xs px-1 rounded-full bg-grey-10">
				{tooltipCount}
			</div>
		</div>
	);
};
