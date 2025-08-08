import {
	CATEGORY_LABEL_MAP,
	CATEGORY_MAP,
	TooltipCategory,
} from '@/entities/review';

import SingleCategorySelect from '@/shared/ui/SingleCategorySelect';

const CATEGORY_OPTIONS = Object.entries(CATEGORY_MAP).map(([key, value]) => ({
	id: Number(key), // 0, 1, 2
	label: CATEGORY_LABEL_MAP[value as TooltipCategory], // '음식', '서비스', '청결'
	value: value as TooltipCategory, // 'food', 'service', 'clean'
}));

const CATEGORY_ID_TO_VALUE_MAP = new Map(
	CATEGORY_OPTIONS.map((opt) => [opt.id, opt.value]),
);

const CATEGORY_VALUE_TO_ID_MAP = new Map(
	CATEGORY_OPTIONS.map((opt) => [opt.value, opt.id]),
);

interface ReviewCategorySelectorProps {
	selectedCategory: TooltipCategory;
	onCategoryChange: (category: TooltipCategory) => void;
	className?: string;
}

export const ReviewCategorySelector = ({
	selectedCategory,
	onCategoryChange,
	className,
}: ReviewCategorySelectorProps) => {
	const handleCategoryChange = (newCategoryId: number) => {
		const newCategory = CATEGORY_ID_TO_VALUE_MAP.get(newCategoryId);
		if (newCategory) {
			onCategoryChange(newCategory);
		}
	};

	const selectedCategoryId =
		CATEGORY_VALUE_TO_ID_MAP.get(selectedCategory) ?? null;

	return (
		<SingleCategorySelect
			value={selectedCategoryId}
			onChange={handleCategoryChange}
			className={className}
		>
			{CATEGORY_OPTIONS.map((opt) => (
				<SingleCategorySelect.Item key={opt.id} value={opt.id}>
					{opt.label}
				</SingleCategorySelect.Item>
			))}
		</SingleCategorySelect>
	);
};
