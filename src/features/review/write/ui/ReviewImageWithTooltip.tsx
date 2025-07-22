'use client';

import { useRef, useState } from 'react';

import { ReviewImage } from '@/entities/review/model/reviewImage';
import { Tooltip } from '@/entities/review/model/tooltip';
import { TooltipBox } from '@/entities/review/ui/TooltipBox';
import { TooltipMarker } from '@/entities/review/ui/TooltipMarker';
import Image from 'next/image';

import { getTailDirection } from '@/shared/bubble/lib/getTailDirection';
import { getBubbleTransformFromMarker } from '@/shared/bubble/model/direction';
import { Bubble } from '@/shared/bubble/ui/Bubble';

import { useImageCoordinate } from '../lib/useImageCoordinate';

interface ReviewImageWithTooltipProps {
	image: ReviewImage;
	onImageClick: (coord: { x: number; y: number }) => void;
	onRemoveTooltip: (tooltipId: string) => void;
	tooltips: Record<string, Tooltip>;
}

export const ReviewImageWithTooltip = ({
	image,
	onImageClick,
	onRemoveTooltip,
	tooltips,
}: ReviewImageWithTooltipProps) => {
	const imgRef = useRef<HTMLImageElement>(null);
	const { getRelativeCoord } = useImageCoordinate(imgRef);
	const [selectedTooltip, setSelectedTooltip] = useState<Tooltip | null>(null);
	const tooltipDirection =
		selectedTooltip && getTailDirection(selectedTooltip.x, selectedTooltip.y);

	const handleImageClick = (e: React.MouseEvent) => {
		const coord = getRelativeCoord(e);
		if (!coord) return;

		onImageClick(coord);
	};

	const handleMarkerClick = (tooltip: Tooltip) => {
		setSelectedTooltip((prev) => (prev?.id === tooltip.id ? null : tooltip));
	};

	return (
		<div className="absolute inset-0 z-20">
			<Image
				ref={imgRef}
				src={image.url}
				onClick={handleImageClick}
				fill
				alt="리뷰이미지"
				className="object-cover rounded-t-lg"
			/>
			{image.tooltipIds.map((id) => {
				const tip = tooltips[id];
				if (!tip) return null;

				return (
					<div
						key={tip.id}
						className="absolute"
						style={{ left: `${tip.x}%`, top: `${tip.y}%` }}
					>
						<div className="relative">
							<TooltipMarker tip={tip} onClick={handleMarkerClick} />
							{tooltipDirection && selectedTooltip?.id === tip.id && (
								<div
									className="absolute z-10"
									style={{
										transform: getBubbleTransformFromMarker(tooltipDirection),
									}}
								>
									<Bubble direction={tooltipDirection}>
										<TooltipBox
											tooltip={tip}
											onDelete={(tooltipId) => onRemoveTooltip(tooltipId)}
										/>
									</Bubble>
								</div>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
};
