import { IconName } from '@/shared/icons/iconMap';
import Icon from '@/shared/ui/Icon';

import { mapCategoryToIconType } from '../lib/RatingIconType';
import { TooltipCategory } from '../model/tooltip';
import { categoryColors } from '../model/tooltipStyleMap';

export const RatingStarView = ({
	value,
	icon = 'Star',
	category,
	iconCount = 5,
	emptyColor = '#F6F9FB',
}: {
	value: number;
	category: TooltipCategory;
	icon?: IconName;
	iconCount?: number;
	emptyColor?: string;
}) => {
	const resolvedIcon = category ? mapCategoryToIconType(category) : icon;
	const color = categoryColors[category];

	return (
		<div className="flex gap-1">
			{[...Array(iconCount)].map((_, index) => {
				const starValue = index + 1;
				const isHalf = value === starValue - 0.5;

				if (isHalf) {
					return (
						<div key={index} style={{ position: 'relative' }}>
							<Icon
								name={resolvedIcon}
								fill={emptyColor}
								size="xxs"
								color={'#D4DEE5'}
							/>
							<div
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									width: '50%',
									overflow: 'hidden',
								}}
							>
								<Icon
									name={resolvedIcon}
									fill={color}
									size="xxs"
									color={'#D4DEE5'}
								/>
							</div>
						</div>
					);
				}

				const isFilled = starValue <= value;

				return (
					<div key={index}>
						<Icon
							name={resolvedIcon}
							color={isFilled ? color : '#D4DEE5'}
							fill={isFilled ? color : emptyColor}
							size="xxs"
						/>
					</div>
				);
			})}
		</div>
	);
};
