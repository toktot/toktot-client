'use client';

import { useRef } from 'react';

import { useImageCoordinate } from '../lib/useImageCoordinate';
import { useTooltipManager } from '../lib/useTooltipManager';
import { TooltipLayer } from './TooltipLayer';

export const ReviewImageWithTooltip = ({ imageUrl }: { imageUrl: string }) => {
	const { tooltips, addTooltip } = useTooltipManager();
	const imgRef = useRef<HTMLImageElement>(null);
	const { getRelativeCoord } = useImageCoordinate(imgRef);

	const handleClick = (e: React.MouseEvent) => {
		const coord = getRelativeCoord(e);
		if (!coord) return;

		addTooltip({ ...coord, category: 'etc' });
	};

	return (
		<div className="relative w-full">
			<img ref={imgRef} src={imageUrl} onClick={handleClick} width={500} />
			<TooltipLayer tooltips={tooltips} />
		</div>
	);
};
