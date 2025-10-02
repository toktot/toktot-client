'use client';

import { useEffect, useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { AppShell } from '@/widgets/layout';

import api from '@/features/home/lib/api';

import Icon from '@/shared/ui/Icon';
import SingleCategorySelect from '@/shared/ui/SingleCategorySelect';

import MenuInfoCard from '../MenuCard';

interface Menu {
	menuId: number;
	menuName: string;
	category: string;
	price: number;
	servingSize: number;
	isMain: boolean;
}
interface Props {
	storeId: number;
}

export default function StoreMenuSection({ storeId }: Props) {
	const [menus, setMenus] = useState<Menu[]>([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	useEffect(() => {
		const fetchMenus = async () => {
			try {
				const res = await api.get(`/v1/restaurants/${storeId}/menus`);
				if (res.data.success && res.data.data) {
					setMenus(res.data.data);
				}
			} catch (err) {
				console.log(err);
			} finally {
				setLoading(false);
			}
		};
		fetchMenus();
	}, [storeId]);
	const categoryTypes = useMemo(() => {
		const types = menus.map((menu) => menu.category);
		return Array.from(new Set(types));
	}, [menus]);

	const [selectedCategory, setSelectedCategory] = useState<number | null>(0);

	const selectedType = categoryTypes[selectedCategory ?? 0];

	const filteredMenu = useMemo(() => {
		return menus.filter((menu) => menu.category === selectedType);
	}, [selectedType, menus]);

	const hasMenu = categoryTypes.length > 0 && filteredMenu.length > 0;
	if (loading) {
		return (
			<div className="flex justify-center items-center py-20">
				<p className="text-center text-base text-grey-50">
					메뉴 불러오는 중...
				</p>
			</div>
		);
	}

	if (!hasMenu) {
		return (
			<div className="bg-grey-10 text-grey-50 flex flex-col justify-center items-center py-30 px-4">
				<p className="text-center text-base mb-2">등록된 메뉴가 없습니다.</p>
				<Link
					href="/review/write"
					className="bg-grey-90 text-primary-40 px-3 py-2 rounded-2xl font-semibold text-[12px]"
				>
					<button
						className="flex flex-wrap justify items-center gap-1"
						onClick={() => router.push('/menu-upload')}
					>
						<Icon name={'Plus'} size="xxs" className="text-primary-40" />
						메뉴판 등록하기
					</button>
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
						<div key={menu.menuId} className="w-[343px] sm:w-[380px]">
							<MenuInfoCard
								review={{
									id: String(menu.menuId),
									menuImageUrl: '',
									menuName: menu.menuName,
									price: menu.price,
									peopleNumber: String(menu.servingSize),
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
