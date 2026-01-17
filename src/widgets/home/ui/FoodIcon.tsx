'use client';

import { useRouter } from 'next/navigation';

import { useCategories } from '@/shared/hooks/useCategories';
import type { IconName } from '@/shared/icons/iconMap';
import Icon from '@/shared/ui/Icon';
import { useState } from 'react';

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
	const [expanded, setExpanded] = useState(false);
	console.log(categories);

	const handleClick = (item: CategoryItem) => {
		if (onSelect) onSelect(item);
		router.push(`/search?q=${encodeURIComponent(item.name)}`);
	};
	const visibleCategories = expanded
	? categories || []
	: categories?.slice(0,9) || [];
	return (
		<div className="bg-white rounded-3xl p-4 cursor-pointer">
			<h2 className="text-[18px] font-semibold text-grey-90 mb-4 ml-3">
				<div className="flex flex-wrap justify items-center gap-2">
					로컬음식
					<button type="button" onClick={() => setExpanded((prev) => !prev)}
						className="transition-transform duration-300">
							{expanded ? <Icon name="ArrowDown" /> : <Icon name="ArrowUp" />}
						
					</button>
				</div>
			</h2>
			<div className="grid grid-cols-5 gap-x-1 gap-y-2">
				{visibleCategories?.map((item, idx) => (
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
