import { ReviewImage } from '@/entities/review';
import clsx from 'clsx';
import Image from 'next/image';

import Icon from '@/shared/ui/Icon';

interface ReviewImageBoxProps {
	image: ReviewImage;
	onClick?: () => void;
	onDelete?: () => void;
	isMain: boolean;
	onSetMain: () => void;
}

export const ReviewImageBox = ({
	image,
	onClick,
	onDelete,
	isMain,
	onSetMain,
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
					<Icon name="Cancel" size="xxs" className="text-white" />
				</button>
			)}
			<button
				className={clsx(
					'absolute top-1 left-1 z-10 flex items-center rounded-full gap-1 p-0.5',
					{
						'bg-primary-50': isMain,
						'bg-grey-70 text-grey-10': !isMain,
					},
				)}
				onClick={(e) => {
					e.stopPropagation();
					onSetMain();
				}}
				aria-label="대표이미지로 설정"
			>
				{isMain ? (
					<Icon name={'FillLocalJeju'} size="xxs" />
				) : (
					<Icon name={'LocalJeju'} size="xxs" />
				)}
				<span className={clsx('text-xs', { 'text-white': isMain })}>대표</span>
			</button>

			<Image src={image.url} alt="리뷰 이미지" fill priority sizes="100px" />
			<div className="absolute bottom-1 right-1 text-primary-50 text-xs px-1 rounded-full bg-grey-10">
				{tooltipCount}
			</div>
		</div>
	);
};
