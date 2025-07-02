'use client';

import { useRef, useState } from 'react';

import { ReviewImage } from '@/entities/review/model/reviewImage';
import { Tooltip } from '@/entities/review/model/tooltip';
import { TooltipBox } from '@/entities/review/ui/TooltipBox';
import Image from 'next/image';

import Icon from '@/widgets/Icon';

import { getTailDirection } from '@/shared/bubble/lib/getTailDirection';
import { getBubbleTransformFromMarker } from '@/shared/bubble/model/direction';
import { Bubble } from '@/shared/bubble/ui/Bubble';

import { TooltipMarker } from '../../../../entities/review/ui/TooltipMarker';
import { useImageCoordinate } from '../lib/useImageCoordinate';

interface ReviewImageWithTooltipProps {
	image: ReviewImage;
	onClose: () => void;
	onUpdateTooltip: (imageId: string, tooltip: Tooltip) => void;
}

export const ReviewImageWithTooltip = ({
	image,
	onClose,
	onUpdateTooltip,
}: ReviewImageWithTooltipProps) => {
	const imgRef = useRef<HTMLImageElement>(null);
	const { getRelativeCoord } = useImageCoordinate(imgRef);
	const [selectedTooltip, setSelectedTooltip] = useState<Tooltip | null>(null);
	const tooltipDirection =
		selectedTooltip && getTailDirection(selectedTooltip.x, selectedTooltip.y);

	const handleImageClick = (e: React.MouseEvent) => {
		const coord = getRelativeCoord(e);
		if (!coord) return;

		const mockFoodTooltip = {
			id: crypto.randomUUID(),
			category: 'food',
			menuName: '불고기',
			price: 12000,
			// 100자
			description:
				'글자수 초과시 인풋박스 안 텍스트 입니다.글자수 초과시 인풋박스 안 텍스트 입니다.글자수 초과시 인풋박스 안 텍스트 입니다.글자수 초과시 인풋박스 안 텍스트 입니다.글dsfdsfd',
		} as Tooltip;

		const newTooltip = { ...coord, ...mockFoodTooltip };

		onUpdateTooltip(image.id, newTooltip); //TODO: 바텀시트 연결 후 데이터 받기 (현재 임시 데이터 처리)
	};

	const handleMarkerClick = (tooltip: Tooltip) => {
		setSelectedTooltip((prev) => (prev?.id === tooltip.id ? null : tooltip));
	};

	return (
		<div className="relative w-full h-100">
			<Image
				ref={imgRef}
				src={image.url}
				onClick={handleImageClick}
				fill
				alt="리뷰이미지"
			/>
			<button className="absolute top-1 right-1 z-10" onClick={onClose}>
				<Icon name="Cancel" size="s" />
			</button>
			{image.tooltips.map((tip) => (
				<div
					key={tip.id}
					className="absolute"
					style={{
						left: `${tip.x}%`,
						top: `${tip.y}%`,
					}}
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
									<TooltipBox tooltip={tip} />
								</Bubble>
							</div>
						)}
					</div>
				</div>
			))}
		</div>
	);
};
