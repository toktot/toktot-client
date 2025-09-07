'use client';

import {
	ReviewView,
	Tooltip,
	TooltipBox,
	TooltipMarker,
} from '@/entities/review';
import Image from 'next/image';

import { getTailDirection } from '@/shared/bubble/lib/getTailDirection';
import { getBubbleTransformFromMarker } from '@/shared/bubble/model/direction';
import { Bubble } from '@/shared/bubble/ui/Bubble';
import Icon from '@/shared/ui/Icon';
import { ProgressBar } from '@/shared/ui/ProgressBar';

import { useImagePagination } from '../lib/useImagePagination';
import { AuthorScoreLabel } from './AuthorScoreLabel';
import { KeywordScroller } from './KeywordScroller';

interface ImagePaginatorProps {
	post: ReviewView;
	onTooltipClick: (tooltip: Tooltip) => void;
	selectTooltip: Tooltip | null;
	onOpenSheet: () => void;
}

export const ImagePaginator = ({
	post,
	onTooltipClick,
	selectTooltip,
	onOpenSheet,
}: ImagePaginatorProps) => {
	const { currentIndex, goToNext, goToPrevious } = useImagePagination(
		post.images.length,
	);
	const currentImage = post.images[currentIndex];

	const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
		if ((e.target as HTMLElement).closest('.tooltip-marker')) {
			return;
		}

		const { clientX, currentTarget } = e;
		const { width } = currentTarget.getBoundingClientRect();

		if (clientX < width / 2) {
			goToPrevious();
		} else {
			goToNext();
		}
	};

	return (
		<div
			className="w-full h-full flex items-center bg-black"
			onClick={handleTap}
		>
			<div className="relative w-full">
				<Image
					src={currentImage.url}
					alt="리뷰 이미지"
					priority={true}
					width={0}
					height={0}
					sizes="100vw"
					style={{
						width: '100%',
						height: 'auto',
					}}
				/>
				{currentImage.tooltipIds.map((id) => {
					const tooltip = post.tooltips[id];
					if (!tooltip) return null;

					const tooltipDirection = getTailDirection(tooltip.x, tooltip.y);

					return (
						<div
							key={tooltip.id}
							className="absolute tooltip-marker"
							style={{ left: `${tooltip.x}%`, top: `${tooltip.y}%` }}
						>
							<TooltipMarker
								tip={tooltip}
								onClick={() => onTooltipClick(tooltip)}
							/>
							{selectTooltip?.id === tooltip.id && (
								<div
									className="absolute z-10"
									style={{
										transform: getBubbleTransformFromMarker(tooltipDirection),
									}}
								>
									<Bubble direction={tooltipDirection}>
										<div className="flex items-center">
											<TooltipBox tooltip={tooltip} />
											<button onClick={onOpenSheet} className="p-1">
												<Icon name={'ArrowRight'} size="xs" />
											</button>
										</div>
									</Bubble>
								</div>
							)}
						</div>
					);
				})}
				<div className="absolute bottom-0 left-0 right-0">
					<ProgressBar total={post.images.length} current={currentIndex} />
				</div>
				<div className="absolute bottom-[12px] left-0 right-0 px-3">
					<div className="mb-2">
						<AuthorScoreLabel score={post.satisfactionScore} />
					</div>
					<KeywordScroller keywords={post.keywords} />
				</div>
			</div>
		</div>
	);
};
