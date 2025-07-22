import Icon from '@/shared/ui/Icon';

import { Tooltip } from '../model/tooltip';
import { RatingStarView } from './RatingStarView';

interface TooltipBoxProps {
	tooltip: Tooltip;
	onDelete: (tooltipId: string) => void;
}

export const TooltipBox = ({ tooltip, onDelete }: TooltipBoxProps) => {
	return (
		<div className="text-xs text-black w-[230px] space-y-[6px] flex gap-3">
			<div className="flex flex-col flex-1 gap-2  min-w-0">
				<div className="flex gap-2">
					{tooltip.category === 'food' && (
						<div className="flex gap-2 min-w-0">
							<div className="text-grey-90 font-semibold overflow-hidden text-ellipsis">
								{tooltip.menuName}
							</div>
							<div className="text-grey-70 whitespace-nowrap">
								{tooltip?.price?.toLocaleString()}원
							</div>
						</div>
					)}
					{tooltip.category === 'service' && (
						<div className="text-grey-90 font-semibold">서비스</div>
					)}
					{tooltip.category === 'clean' && (
						<div className="text-grey-90 font-semibold">청결</div>
					)}
					<RatingStarView value={tooltip.rating} category={tooltip.category} />
				</div>
				{tooltip.description && (
					<p className="text-grey-80 overflow-hidden text-ellipsis whitespace-nowrap">
						{tooltip.description}
					</p>
				)}
			</div>

			<button
				onClick={() => onDelete(tooltip.id)}
				className="bg-sub-red-10 flex flex-col w-12 p-2 justify-center items-center rounded-xl"
			>
				<Icon name={'Trash'} className="text-sub-red-30" />
				<span className="text-sub-red-30 text-[9px] font-medium">삭제하기</span>
			</button>
		</div>
	);
};
