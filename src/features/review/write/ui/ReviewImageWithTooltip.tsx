'use client';

import { useRef } from 'react';

import { useTooltipManager } from '@/entities/review/lib/useTooltipManager';
import { TooltipLayer } from '@/entities/review/ui/TooltipLayer';

import { useImageCoordinate } from '../lib/useImageCoordinate';

export const ReviewImageWithTooltip = ({ imageUrl }: { imageUrl: string }) => {
	const { tooltips, addTooltip } = useTooltipManager();
	const imgRef = useRef<HTMLImageElement>(null);
	const { getRelativeCoord } = useImageCoordinate(imgRef);

	const handleImageClick = (e: React.MouseEvent) => {
		const coord = getRelativeCoord(e);
		if (!coord) return;

		addTooltip({ ...coord, category: 'food' });
	};

	return (
		<div className="relative w-full">
			<img ref={imgRef} src={imageUrl} onClick={handleImageClick} width={500} />
			<TooltipLayer tooltips={tooltips} />
		</div>
	);
};
