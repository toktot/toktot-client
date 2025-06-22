import { Tooltip } from '@/entities/review/model/tooltip';

import Icon from '@/widgets/Icon';

interface Props {
	tooltips: Tooltip[];
}

export const TooltipLayer = ({ tooltips }: Props) => {
	return (
		<>
			{tooltips.map((tip) => {
				return (
					<div
						key={tip.id}
						className="absolute w-[28px] h-[28px] rounded-xl bg-primary-50 flex items-center justify-center"
						style={{
							left: `${tip.x}%`,
							top: `${tip.y}%`,
							transform: 'translate(-50%, -50%)',
						}}
					>
						<Icon name={'KoreanDish'} size="xs" color="white" />
					</div>
				);
			})}
		</>
	);
};
