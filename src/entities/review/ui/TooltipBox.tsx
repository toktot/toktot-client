import { Tooltip } from '../model/tooltip';

export const TooltipBox = ({ tooltip }: { tooltip: Tooltip }) => {
	return (
		<div className="text-xs text-black min-w-[270px] space-y-[6px]">
			{tooltip.category === 'food' && (
				<div className="flex gap-2">
					<div className="text-grey-90 font-semibold">{tooltip.menuName}</div>
					<div className="text-grey-70">{tooltip.price.toLocaleString()}원</div>
				</div>
			)}

			{tooltip.description && (
				<p className="text-grey-80 whitespace-pre-line">
					{tooltip.description}
				</p>
			)}
		</div>
	);
};
