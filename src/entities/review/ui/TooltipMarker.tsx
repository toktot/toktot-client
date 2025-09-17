import { Tooltip } from '@/entities/review/model/tooltip';
import { tooltipMarkerStyleMap } from '@/entities/review/model/tooltipStyleMap';

import Icon from '@/shared/ui/Icon';

interface TooltipMarkerProps {
	tip: Tooltip;
	onClick?: (tooltip: Tooltip) => void;
}

export const TooltipMarker = ({ tip, onClick }: TooltipMarkerProps) => {
	const style = tooltipMarkerStyleMap[tip.category];

	return (
		<div
			className={`absolute w-[28px] h-[28px] rounded-xl flex items-center justify-center cursor-pointer ${style.bgColor}`}
			style={{
				left: `${tip.x}%`,
				top: `${tip.y}%`,
				transform: 'translate(-50%, -50%)',
			}}
			onClick={() => onClick?.(tip)}
		>
			<Icon name={style.icon} size="xs" color={style.iconColor} />
		</div>
	);
};
