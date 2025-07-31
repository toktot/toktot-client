'use client';

import type { IconName } from '@/shared/icons/iconMap';
import Icon from '@/shared/ui/Icon';

interface CategoryItem {
	name: string;
	icon: IconName;
}
const categories: CategoryItem[] = [
	{ name: '돔베고기', icon: 'DombeGogi' },
	{ name: '고기국수', icon: 'RawFishSoup' },
	{ name: '성게미역국', icon: 'Seaweedsoup' },
	{ name: '고사리해장국', icon: 'Gosali' },
	{ name: '성게미역국', icon: 'RawFish' },
	{ name: '옥돔구이', icon: 'Ogdom' },
	{ name: '갈치구이', icon: 'Galchi' },
	{ name: '회/물회', icon: 'RawFish' },
	{ name: '빙떡', icon: 'Bingtteok' },
	{ name: '오메기떡', icon: 'Omegitteok' },
];

const CategoryGrid = () => {
	return (
		<div className="bg-[#F9FAFB] rounded-xl p-4">
			<h2 className="text-base font-semibold text-gray-800 mb-4">향토음식</h2>
			<div className="grid grid-cols-5 gap-x-2 gap-y-4">
				{categories.map((item, idx) => (
					<div
						key={idx}
						className="flex flex-col items-center text-center text-xs text-gray-700"
					>
						<div className="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-sm mb-1">
							<Icon name={item.icon} />
						</div>
						<span>{item.name}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default CategoryGrid;
