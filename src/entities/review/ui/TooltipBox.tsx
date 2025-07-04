import Icon from '@/widgets/Icon';

import { Tooltip } from '../model/tooltip';

interface TooltipBoxProps {
	tooltip: Tooltip;
	onDelete: (tooltipId: string) => void;
}

export const TooltipBox = ({ tooltip, onDelete }: TooltipBoxProps) => {
	return (
		<div className="text-xs text-black min-w-[270px] space-y-[6px] flex gap-3">
			<div className="flex flex-col flex-1 gap-2">
				{tooltip.category === 'food' && (
					<div className="flex gap-2">
						<div className="text-grey-90 font-semibold">{tooltip.menuName}</div>
						<div className="text-grey-70">
							{tooltip.price.toLocaleString()}원
						</div>
						<div className="text-grey-70">{tooltip.rating}</div>
					</div>
				)}

				{tooltip.description && (
					<p className="text-grey-80 whitespace-pre-line">
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
