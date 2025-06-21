import { Tooltip } from '@/entities/review/model/tooltip';

import Icon from '@/widgets/Icon';

interface Props {
	tooltips: Tooltip[];
}

export const TooltipLayer = ({ tooltips }: Props) => {
	return (
		<>
			{tooltips.map((tip) => (
				<Icon
					key={tip.id}
					name={'KoreanDish'}
					className="absolute"
					style={{
						left: `${tip.x}%`,
						top: `${tip.y}%`,
						transform: 'translate(-50%, -50%)',
					}}
				/>
			))}
		</>
	);
};
