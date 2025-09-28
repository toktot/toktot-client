'use client';

import { useEffect, useState } from 'react';

import { mockLocalFoodAlarms } from '@/entities/menuPrice/mockLocal';

import { useCategories } from '@/shared/hooks/useCategories';
import Icon from '@/shared/ui/Icon';

export default function AlarmBox() {
	const { categories } = useCategories();
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % mockLocalFoodAlarms.length);
		}, 3000);
		return () => clearInterval(interval);
	}, []);
	const currentAlarm = mockLocalFoodAlarms[currentIndex];
	const matchedCategory = categories?.find(
		(c) => c.name === currentAlarm.alarmFood,
	);

	return (
		<div className="mx-4 mt-3">
			<div className="inline-flex items-center justify-between gap-3 w-full px-4 py-2 bg-white rounded-full bg-primary-5 text-primary-60 text-sm">
				<div className="flex items-center gap-2">
					{matchedCategory ? (
						<Icon name={matchedCategory.icon} />
					) : (
						<span className=""></span>
					)}
					<div className="flex items-center gap-2 text-[12px]">
						<span className="text-xs text-primary-50">
							{currentAlarm.timeAgo}
						</span>
					</div>
					<span className="text-[12px] font-semibold text-grey-90 truncate max-w-[150px]">
						{currentAlarm.alarmFood}
					</span>
					<div className="flex gap-0.5">
						<span className="text-grey-80 text-[12px]">평균</span>
						<span className="text-grey-90 font-semibold text-[12px]">
							{currentAlarm.price}
						</span>
						<span className="text-grey-80 text-[12px]">원</span>
					</div>
				</div>
				<span className="text-grey-60 font-semibold text-[12px]">더보기</span>
			</div>
		</div>
	);
}
