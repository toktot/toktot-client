import { Tooltip } from '@/entities/review/model/tooltip';

import Icon from '@/widgets/Icon';

import { tooltipStyleMap } from '../model/tooltipStyleMap';

interface Props {
	tooltips: Tooltip[];
}

export const TooltipLayer = ({ tooltips }: Props) => {
	return (
		<>
			{tooltips.map((tip) => {
				const style = tooltipStyleMap[tip.category];

				return (
					<div
						key={tip.id}
						className={`absolute w-[28px] h-[28px] rounded-xl flex items-center justify-center ${style.bgColor}`}
						style={{
							left: `${tip.x}%`,
							top: `${tip.y}%`,
							transform: 'translate(-50%, -50%)',
						}}
					>
						<Icon name={style.icon} size="xs" color={style.iconColor} />
					</div>
				);
			})}
		</>
	);
};
