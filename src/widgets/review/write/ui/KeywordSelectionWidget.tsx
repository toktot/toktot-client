'use client';

import { type Keyword, KeywordCategory } from '@/entities/keyword/config/data';

import { useKeywordStore } from '@/features/review/write/model/useKeywordStore';

import { KeywordId } from '@/shared/model/types';
import MultiCategorySelect from '@/shared/ui/MultiCategorySelect';
import Typography from '@/shared/ui/Typography';

interface KeywordSelectionWidgetProps {
	title: string;
	category: KeywordCategory;
	keywords: Keyword[];
}

export const KeywordSelectionWidget = ({
	title,
	category,
	keywords,
}: KeywordSelectionWidgetProps) => {
	const selectedSet = useKeywordStore(
		(state) => state.selectedKeywords[category],
	);
	const selectedIds = Array.from(selectedSet);

	const toggleKeyword = useKeywordStore((state) => state.toggleKeyword);

	const handleChange = (value: number) => {
		toggleKeyword(category, value as KeywordId);
	};

	return (
		<section className="w-full space-y-3">
			<Typography as="h3">{title}</Typography>
			<MultiCategorySelect value={selectedIds} onChange={handleChange}>
				{keywords.map((keyword) => (
					<MultiCategorySelect.Item key={keyword.id} value={keyword.id}>
						{keyword.label}
					</MultiCategorySelect.Item>
				))}
			</MultiCategorySelect>
		</section>
	);
};
