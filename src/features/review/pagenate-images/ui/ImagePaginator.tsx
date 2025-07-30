'use client';

import { Tooltip, TooltipMarker } from '@/entities/review';
import Image from 'next/image';

import { ReviewImageId, TooltipId } from '@/shared/model/types';
import { ProgressBar } from '@/shared/ui/ProgressBar';

import { useImagePagination } from '../lib/useImagePagination';

interface ImagePaginatorProps {
	images: { id: ReviewImageId; url: string; tooltipIds: TooltipId[] }[];
	tooltips: Record<TooltipId, Tooltip>;
	onTooltipClick: (tooltip: Tooltip) => void;
}

export const ImagePaginator = ({
	images,
	tooltips,
	onTooltipClick,
}: ImagePaginatorProps) => {
	const { currentIndex, goToNext, goToPrevious } = useImagePagination(
		images.length,
	);
	const currentImage = images[currentIndex];

	const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
		if ((e.target as HTMLElement).closest('.tooltip-marker')) {
			return;
		}

		const { clientX, currentTarget } = e;
		const { width } = currentTarget.getBoundingClientRect();

		if (clientX < width / 2) {
			console.log('go prev');
			goToPrevious();
		} else {
			console.log('go next');
			goToNext();
		}
	};

	return (
		<div className="w-full h-full cursor-pointer" onClick={handleTap}>
			<Image
				src={currentImage.url}
				alt="리뷰 이미지"
				layout="fill"
				objectFit="contain"
				priority={true}
			/>
			{currentImage.tooltipIds.map((id) => {
				const tooltip = tooltips[id];
				if (!tooltip) return null;

				return (
					<div key={id} className="tooltip-marker">
						<TooltipMarker
							tip={tooltip}
							onClick={() => onTooltipClick(tooltip)}
						/>
					</div>
				);
			})}
			<div className="absolute bottom-2 left-4 right-4">
				<ProgressBar total={images.length} current={currentIndex} />
			</div>
		</div>
	);
};
