'use client';

import { PLACE_MOOD } from '@/entities/review/constants/categories';

import CategorySelect from '@/shared/ui/CategorySelect';

import { useSelectedCategory } from '../model/useSelectedCategory';

const ReviewMoodFilterPanel = () => {
	const { selectedCategory, changeCategory } = useSelectedCategory(0);

	return (
		<CategorySelect
			value={selectedCategory}
			onChange={(value) => changeCategory(value)}
		>
			<CategorySelect.Item value={0}>전체</CategorySelect.Item>
			{PLACE_MOOD.map(({ value, label }) => (
				<CategorySelect.Item key={value} value={value}>
					{label}
				</CategorySelect.Item>
			))}
		</CategorySelect>
	);
};

export default ReviewMoodFilterPanel;
