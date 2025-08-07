'use client';

import { useRouter } from 'next/navigation';

import type { IconName } from '@/shared/icons/iconMap';
import Icon from '@/shared/ui/Icon';

interface CategoryItem {
	name: string;
	icon: IconName;
	id: number;
	type?: string;
}

interface Props {
	onSelect?: (item: CategoryItem) => void;
}
export const categories: CategoryItem[] = [
	{ name: '돔베고기', icon: 'DombeGogi', id: 1, type: '향토음식' },
	{ name: '고기국수', icon: 'RawFishSoup', id: 2, type: '향토음식' },
	{ name: '성게미역국', icon: 'Seaweedsoup', id: 3, type: '향토음식' },
	{ name: '고사리해장국', icon: 'Gosali', id: 4, type: '향토음식' },
	{ name: '성게미역국', icon: 'RawFish', id: 5, type: '향토음식' },
	{ name: '옥돔구이', icon: 'Ogdom', id: 6, type: '향토음식' },
	{ name: '갈치구이', icon: 'Galchi', id: 7, type: '향토음식' },
	{ name: '회/물회', icon: 'RawFish', id: 8, type: '향토음식' },
	{ name: '빙떡', icon: 'Bingtteok', id: 9, type: '향토음식' },
	{ name: '오메기떡', icon: 'Omegitteok', id: 10, type: '향토음식' },
];

const CategoryGrid: React.FC<Props> = ({}) => {
	const router = useRouter();

	const handleClick = (item: CategoryItem) => {
		router.push(`/search?q=${encodeURIComponent(item.name)}`);
	};
	return (
		<div className="bg-[#F9FAFB] rounded-xl p-4">
			<h2 className="text-base font-semibold text-gray-800 mb-4">향토음식</h2>
			<div className="grid grid-cols-5 gap-x-2 gap-y-4">
				{categories.map((item, idx) => (
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
