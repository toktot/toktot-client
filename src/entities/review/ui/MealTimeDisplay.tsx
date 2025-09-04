import React from 'react';

import clsx from 'clsx';

import Icon from '@/shared/ui/Icon';

import { MEAL_TIME_MAP, ServerMealTime } from '../model/mealtime';

interface MealTimeDisplayProps {
	mealTime: ServerMealTime | string;
	className?: string;
}

export const MealTimeDisplay = ({
	mealTime,
	className,
}: MealTimeDisplayProps) => {
	const mapping = MEAL_TIME_MAP[mealTime as ServerMealTime];

	if (!mapping) {
		return <div className={className}>{mealTime}</div>;
	}

	return (
		<div className={clsx('flex items-center gap-1', className)}>
			<Icon size="s" name={mapping.icon} />
			<span>{mapping.text}</span>
		</div>
	);
};
