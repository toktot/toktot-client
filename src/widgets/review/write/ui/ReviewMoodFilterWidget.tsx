'use client';

import { useMoodFilter } from '@/entities/review/lib/useMoodFilter';
import { PLACE_MOOD_KEYWORDS } from '@/entities/review/model/moodKeywords';
import clsx from 'clsx';

import Icon from '@/shared/ui/Icon';
import MultiCategorySelect from '@/shared/ui/MultiCategorySelect';

export const ReviewMoodFilterWidget = () => {
	const { selectedIds, toggleMood } = useMoodFilter([0]);

	return (
		<section className="w-full space-y-3">
			<h3 className="text-lg font-semibold">키워드 등록</h3>
			<MultiCategorySelect value={selectedIds} onChange={toggleMood}>
				<MultiCategorySelect.Item value={0}>전체</MultiCategorySelect.Item>

				{PLACE_MOOD_KEYWORDS.map(
					({
						id,
						label,
						iconName,
						activeClassName,
						iconFillColor,
						activeIconName,
					}) => {
						const isActive = selectedIds.includes(id);
						const iconToRender =
							isActive && activeIconName ? activeIconName : iconName;

						return (
							<MultiCategorySelect.Item
								key={id}
								value={id}
								className={clsx(isActive && activeClassName)}
							>
								<div className="flex items-center justify-center gap-1.5">
									{iconToRender && (
										<Icon name={iconToRender} size="xs" fill={iconFillColor} />
									)}
									<span>{label}</span>
								</div>
							</MultiCategorySelect.Item>
						);
					},
				)}
			</MultiCategorySelect>
		</section>
	);
};
