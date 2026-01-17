'use client';

import { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { CategoryItem } from '@/widgets/home/ui/FoodIcon';

import { useCategories } from '@/shared/hooks/useCategories';
import Icon from '@/shared/ui/Icon';

export default function SearchResultSection() {
	const searchParams = useSearchParams();
	const q = searchParams.get('q') ?? '';
	const router = useRouter();

	const [query, setQuery] = useState(q);

	const handleClick = (item: CategoryItem) => {
		router.push(`/MenuPrice?q=${encodeURIComponent(item.name)}`);
	};
	const { categories } = useCategories();

	useEffect(() => {
		setQuery(q);
	}, [q]);

	// 가격 정보 가져오기

	return (
		<>
			<header className="w-full px-4 py-3 flex items-center justify-between bg-white">
				<button onClick={() => router.back()}>
					<Icon name={'ArrowLeftBar'} className="ml-1" />
				</button>
				<div className="text-base font-semibold">{query}</div>
				<Icon name="Bell" className="w-[48px] h-[48px]" />
			</header>
			<div className="w-full px-3 py-2 overflow-x-auto scrollbar-hide whitespace-nowrap flex gap-4 bg-white">
				{categories?.map((item, idx) => {
					const isSelected = item.name === query;
					return (
						<button
							key={idx}
							onClick={() => handleClick(item)}
							className="flex flex-col items-center text-center text-xs text-gray-700"
						>
							<div
								className={`rounded-xl w-12 h-12 flex items-center justify-center mb-1
						${isSelected ? 'bg-primary-20 border border-primary-30' : 'bg-grey-10'}`}
							>
								<Icon name={item.icon} />
							</div>
							<span
								className={`${isSelected ? 'text-primary-40' : 'text-grey-80'}`}
							>
								{item.name}
							</span>
						</button>
					);
				})}

				{/* 리뷰 탭 콘텐츠 */}
			</div>
		</>
	);
}
