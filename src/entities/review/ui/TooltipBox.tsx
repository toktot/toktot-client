import Icon from '@/widgets/Icon';

import { Tooltip } from '../model/tooltip';

interface TooltipBoxProps {
	tooltip: Tooltip;
	onDelete: (tooltipId: string) => void;
}

export const TooltipBox = ({ tooltip, onDelete }: TooltipBoxProps) => {
	return (
		<div className="text-xs text-black min-w-[270px] space-y-[6px] flex gap-3">
			<div className="flex flex-col">
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
				className="bg-[#FFF9F9] flex items-center rounded-xl"
			>
				<Icon name={'Trash'} className="text-[#FF2626]" />
			</button>
		</div>
	);
};
