'use client';

import { type Keyword, KeywordCategory } from '@/entities/keyword/config/data';
import clsx from 'clsx';

import { useKeywordStore } from '@/features/review/write/model/useKeywordStore';

import { IconName } from '@/shared/icons/iconMap';
import { KeywordId } from '@/shared/model/types';
import Icon from '@/shared/ui/Icon';
import SingleCategorySelect from '@/shared/ui/SingleCategorySelect';
import Typography from '@/shared/ui/Typography';

interface SingleKeywordSelectionWidgetProps {
	title: string;
	category: KeywordCategory;
	keywords: Keyword[];
}

const getMealtimeIcon = (keywordId: KeywordId): IconName => {
	const iconMap = {
		701: 'breakfast',
		702: 'lunch',
		703: 'dinner',
	} as const;

	return iconMap[keywordId as keyof typeof iconMap];
};

export const MealTimeSelectionWidget = ({
	title,
	category,
	keywords,
}: SingleKeywordSelectionWidgetProps) => {
	const selectedSet = useKeywordStore(
		(state) => state.selectedKeywords[category],
	);

	const selectedId = selectedSet.size > 0 ? Array.from(selectedSet)[0] : null;
	const selectKeyword = useKeywordStore((state) => state.selectSingleKeyword);

	const handleChange = (value: number) => {
		selectKeyword(category, value as KeywordId);
	};

	return (
		<section className="w-full space-y-3">
			<Typography as="h3">{title}</Typography>
			<SingleCategorySelect
				value={selectedId}
				onChange={handleChange}
				className="flex justify-center"
			>
				{keywords.map((keyword) => {
					const iconName = getMealtimeIcon(keyword.id);

					return (
						<SingleCategorySelect.Item
							key={keyword.id}
							value={keyword.id}
							className="w-27 h-27 rounded-[20px] border-none p-0"
						>
							{(isActive) => (
								<div
									className={clsx(
										'w-full h-full flex flex-col gap-2 items-center justify-center rounded-lg font-bold ',
										isActive
											? 'bg-primary-10 text-primary-50 border-primary-30 border'
											: 'bg-grey-10 text-grey-50',
									)}
								>
									<Icon size="xxl" name={iconName as IconName} />
									<span className="text-sm font-semibold">{keyword.label}</span>
								</div>
							)}
						</SingleCategorySelect.Item>
					);
				})}
			</SingleCategorySelect>
		</section>
	);
};
