'use client';

import { useMemo, useState } from 'react';

import { mockMenu } from '@/entities/store/menu/mockMenu';
import Link from 'next/link';

import { AppShell } from '@/widgets/layout';

import Icon from '@/shared/ui/Icon';
import SingleCategorySelect from '@/shared/ui/SingleCategorySelect';

import MenuInfoCard from '../MenuCard';

export default function StoreMenuSection() {
	const categoryTypes = useMemo(() => {
		const types = mockMenu.map((menu) => menu.type);
		return Array.from(new Set(types));
	}, []);

	const [selectedCategory, setSelectedCategory] = useState<number | null>(
		categoryTypes.length > 0 ? 0 : null,
	);

	const selectedType = categoryTypes[selectedCategory ?? 0];

	const filteredMenu = useMemo(() => {
		return mockMenu.filter((menu) => menu.type === selectedType);
	}, [selectedType]);

	const hasMenu = categoryTypes.length > 0 && filteredMenu.length > 0;

	if (!hasMenu) {
		return (
			<div className="bg-grey-10 text-grey-50 flex flex-col justify-center items-center py-20 px-4 rounded-xl">
				<p className="text-center text-base mb-6">등록된 메뉴가 없습니다.</p>
				<Link
					href="/review/write"
					className="bg-grey-90 text-primary-40 px-6 py-3 rounded-2xl font-semibold"
				>
					리뷰 쓰러가기
					<Icon name={'Plus'} />
				</Link>
			</div>
		);
	}

	return (
		<AppShell showBottomNav={true}>
			<section className="p-4">
				<SingleCategorySelect
					value={selectedCategory}
					onChange={setSelectedCategory}
				>
					{categoryTypes.map((type, index) => (
						<SingleCategorySelect.Item key={type} value={index}>
							{type}
						</SingleCategorySelect.Item>
					))}
				</SingleCategorySelect>

				<div className="mt-2 flex flex-col items-start w-full">
					{filteredMenu.map((menu, index) => (
						<div key={menu.id} className="w-full">
							<MenuInfoCard
								review={{
									id: String(menu.id),
									menuImageUrl: menu.imageUrl,
									menuName: menu.menuName,
									price: menu.price,
									peopleNumber: menu.peopleNumber,
								}}
							/>
							{/* 마지막 카드가 아니면 선 추가 */}
							{index !== filteredMenu.length - 1 && (
								<div className="bg-grey-10 w-full h-[1px]" />
							)}
						</div>
					))}
				</div>
			</section>
		</AppShell>
	);
}
