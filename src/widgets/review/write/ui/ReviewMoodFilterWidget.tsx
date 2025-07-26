'use client';

import { useMoodFilter } from '@/entities/review';
import { MOOD_KEYWORDS, MOOD_KEYWORD_STYLE_MAP } from '@/entities/store';
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

				{MOOD_KEYWORDS.map((keyword) => {
					const style = MOOD_KEYWORD_STYLE_MAP[keyword.id];
					const isActive = selectedIds.includes(keyword.id);
					const iconToRender =
						isActive && style?.activeIconName
							? style.activeIconName
							: style?.iconName;

					return (
						<MultiCategorySelect.Item
							key={keyword.id}
							value={keyword.id}
							className={clsx(isActive && style?.activeClassName)}
						>
							<div className="flex items-center justify-center gap-1.5">
								{iconToRender && (
									<Icon
										name={iconToRender}
										size="xs"
										fill={style?.iconFillColor}
									/>
								)}
								<span>{keyword.label}</span>
							</div>
						</MultiCategorySelect.Item>
					);
				})}
			</MultiCategorySelect>
		</section>
	);
};
