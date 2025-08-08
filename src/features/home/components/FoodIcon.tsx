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

	const handleClick = (item: CategoryItem) => {
		if (onSelect) onSelect(item);
		router.push(`/search?q=${encodeURIComponent(item.name)}`);
	};
	return (
		<div className="bg-[#F9FAFB] rounded-xl p-4">
			<h2 className="text-base font-semibold text-gray-800 mb-4">향토음식</h2>
			<div className="grid grid-cols-5 gap-x-2 gap-y-4">
				{categories?.map((item, idx) => (
					<button
						key={idx}
						type="button"
						onClick={() => handleClick(item)}
						className="flex flex-col items-center text-center text-xs text-gray-700"
					>
						<div className="bg-white rounded-2xl w-12 h-12 flex items-center justify-center shadow-sm mb-1">
							<Icon name={item.icon} />
						</div>
						<span>{item.name}</span>
					</button>
				))}
			</div>
		</div>
	);
};

export default CategoryGrid;
export type { CategoryItem };
