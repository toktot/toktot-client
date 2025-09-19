'use client';

import { useRouter } from 'next/navigation';

import { useCategories } from '@/shared/hooks/useCategories';
import type { IconName } from '@/shared/icons/iconMap';
import Icon from '@/shared/ui/Icon';

interface CategoryItem {
	name: string;
	icon: IconName;
	id?: number;
	type?: string;
}

interface Props {
	onSelect?: (item: CategoryItem) => void;
}

const CategoryGrid: React.FC<Props> = ({ onSelect }) => {
	const router = useRouter();
	const { categories } = useCategories();
	console.log(categories);

	const handleClick = (item: CategoryItem) => {
		if (onSelect) onSelect(item);
		router.push(`/search?q=${encodeURIComponent(item.name)}`);
	};
	return (
		<div className="bg-white rounded-3xl p-4 cursor-pointer">
			<h2 className="text-[18px] font-semibold text-grey-90 mb-4 ml-3">
				로컬음식
			</h2>
			<div className="grid grid-cols-5 gap-x-1 gap-y-2">
				{categories?.map((item, idx) => (
					<button
						key={idx}
						type="button"
						onClick={() => handleClick(item)}
						className="flex flex-col items-center text-center text-xs text-gray-700"
					>
						<div className=" flex items-center justify-center mb-1">
							<Icon name={item.icon} size="xxl" />
						</div>
						<span className="text-[12px] text-grey-60">{item.name}</span>
					</button>
				))}
			</div>
		</div>
	);
};

export default CategoryGrid;
export type { CategoryItem };
