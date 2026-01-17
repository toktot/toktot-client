import { detailCategories } from '@/entities/cataegory/detailCategories';
import clsx from 'clsx';

import MultiCategorySelect from '@/shared/ui/MultiCategorySelect';

export default function CategorySection({
	categoryId,
	detailSelections,
	toggleDetailSelection,
}: {
	categoryId: string;
	detailSelections: Record<string, number[]>;
	toggleDetailSelection: (categoryId: string, optionId: number) => void;
}) {
	const category = detailCategories.find((c) => c.id === categoryId);
	if (!category) return null;

	return (
		<div className="mb-5">
			<div className="mb-2 font-semibold text-[18px] text-[#000000]">
				{category.label}
			</div>
			<MultiCategorySelect
				value={detailSelections[category.id] || []}
				onChange={(optionId: number) =>
					toggleDetailSelection(category.id, optionId)
				}
			>
				{category.options.map((option) => {
					const isActive = (detailSelections[category.id] || []).includes(
						option.id,
					);
					return (
						<MultiCategorySelect.Item
							key={option.id}
							value={option.id}
							className={clsx(
								'border border-grey-30 px-3 py-1 rounded-full text-[14px] text-grey-60 font-medium select-none',
								isActive
									? 'text-white bg-grey-90'
									: 'border-grey-60 text-grey-60',
							)}
						>
							<span>{option.label}</span>
						</MultiCategorySelect.Item>
					);
				})}
			</MultiCategorySelect>
		</div>
	);
}
