'use client';

import {
	CATEGORY_LABEL_MAP,
	CATEGORY_MAP,
	TooltipCategory,
} from '@/entities/review';

import SingleCategorySelect from '@/shared/ui/SingleCategorySelect';

type BaseCategory = TooltipCategory;
type ExtendedCategory = BaseCategory | 'all';

const CATEGORY_BASE_OPTIONS = Object.entries(CATEGORY_MAP).map(
	([key, value]) => ({
		id: Number(key),
		label: CATEGORY_LABEL_MAP[value as BaseCategory],
		value: value as BaseCategory,
	}),
);

// 함수 오버로딩을 위한 타입 정의
type Props = {
	className?: string;
} & (
	| {
			showAllOption: true;
			selectedCategory: ExtendedCategory;
			onCategoryChange: (category: ExtendedCategory) => void;
	  }
	| {
			showAllOption?: false;
			selectedCategory: BaseCategory;
			onCategoryChange: (category: BaseCategory) => void;
	  }
);

export function ReviewCategorySelector({ ...props }: Props) {
	const { className, selectedCategory, onCategoryChange, showAllOption } =
		props as Props & { showAllOption?: boolean };

	const CATEGORY_OPTIONS = showAllOption
		? [
				{ id: -1, label: '전체', value: 'all' as const },
				...CATEGORY_BASE_OPTIONS,
			]
		: CATEGORY_BASE_OPTIONS;

	const CATEGORY_ID_TO_VALUE_MAP = new Map(
		CATEGORY_OPTIONS.map((opt) => [opt.id, opt.value]),
	);

	const CATEGORY_VALUE_TO_ID_MAP = new Map(
		CATEGORY_OPTIONS.map((opt) => [opt.value, opt.id]),
	);

	const handleCategoryChange = (newCategoryId: number) => {
		const newCategory = CATEGORY_ID_TO_VALUE_MAP.get(newCategoryId);
		if (newCategory) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onCategoryChange(newCategory as any);
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
}
