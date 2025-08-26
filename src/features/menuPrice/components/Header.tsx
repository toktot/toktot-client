'use client';

import { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { CategoryItem } from '@/features/home/components/FoodIcon';

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
					<Icon name={'ArrowLefttBar'} className="ml-1" />
				</button>
				<div className="text-base font-semibold">{query}</div>
				<Icon name="Bell" />
			</header>
			<div className="w-full px-3 py-2 overflow-x-auto whitespace-nowrap flex gap-4 bg-white">
				{categories?.map((item, idx) => {
					const isSelected = item.name === query;
					return (
						<button
							key={idx}
							onClick={() => handleClick(item)}
							className="flex flex-col items-center text-center text-xs text-gray-700"
						>
							<div
								className={`rounded-md w-12 h-12 flex items-center justify-center shadow-sm mb-1
						${isSelected ? 'bg-primary-20 border-primary-20' : 'bg-white'}`}
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
