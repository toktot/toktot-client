import { ReviewImage } from '@/entities/review';
import Image from 'next/image';

import Icon from '@/shared/ui/Icon';

interface ReviewImageBoxProps {
	image: ReviewImage;
	onClick?: () => void;
	onDelete?: () => void;
}

export const ReviewImageBox = ({
	image,
	onClick,
	onDelete,
}: ReviewImageBoxProps) => {
	const tooltipCount = image.tooltipIds.length;

	return (
		<div
			onClick={onClick}
			className="w-[100px] h-[100px] bg-grey-10 flex items-center justify-center rounded-xl flex-shrink-0 relative cursor-pointer"
		>
			{onDelete && (
				<button
					className="absolute top-1 right-1 z-10 p-0.5 bg-grey-80 rounded-full"
					onClick={(e) => {
						e.stopPropagation();
						onDelete();
					}}
					aria-label="이미지 삭제"
				>
					<Icon name="Cancel" size="s" className="text-white" />
				</button>
			)}
			<Image src={image.url} alt="리뷰 이미지" fill priority sizes="100px" />
			<div className="absolute bottom-1 right-1 text-primary-50 text-xs px-1 rounded-full bg-grey-10">
				{tooltipCount}
			</div>
		</div>
	);
};
