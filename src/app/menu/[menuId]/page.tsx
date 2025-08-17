'use client';

import { useMemo } from 'react';

import { mockMenu } from '@/entities/store/menu/mockMenu';
import { useParams } from 'next/navigation';

import { BottomNav, BottomNavItem } from '@/widgets/layout';
import { CenterButton } from '@/widgets/layout/ui/BottomNav';

import MenuChart from '@/features/StoreDetail/components/[menuId]/MenuGraph';

export default function MenuDetailPage() {
	const params = useParams();

	const menuId = params.menuId as string;

	// 단일 Review 객체 추출
	const store = useMemo(() => {
		return mockMenu.find((s) => s.id === menuId);
	}, [menuId]);
	console.log(store);
	const numberOnly = parseInt(store?.peopleNumber ?? '');
	if (!store) {
		return (
			<div className="flex items-center justify-center h-screen text-lg font-semibold">
				가게 정보를 찾을 수 없습니다.
			</div>
		);
	}

	return (
		<div className="relative min-h-screen">
			<div
				className="relative w-full h-[300px] bg-cover bg-center"
				style={{
					backgroundImage: `url('${store.imageUrl ?? '/images/default.jpg'}')`,
				}}
			>
				<div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-white rounded-xl px-4 py-3 shadow-md w-[343px] z-20">
					<h1 className="text-[20px] font-semibold text-grey-85">
						{store.menuName}
					</h1>
					<h2 className="text-[24px] font-bold texty-grey-90">
						{store.price}원
					</h2>
					<span className="text-primary-50 text-[14px] font-semibold text-base mr-2">
						{store.peopleNumber}
					</span>
					<span className="text-grey-60 text-[12px] text-base mr-1">
						1인분 당
					</span>
					<span className="text-grey-80 text-[12px]">
						{Number(store.price) / Number(numberOnly)}원
					</span>
				</div>
			</div>

			<div className="relative z-10 -mt-8 pt-[100px] bg-grey-10 px-6 pb-10">
				<div className="flex items-center mb-2">
					<MenuChart />
				</div>
				<section>
					<BottomNav>
						<BottomNavItem
							href="/home"
							iconName="Home"
							label="home"
							foreActive
						/>
						<BottomNavItem href="/review" iconName="Review" label="review" />
						<CenterButton href="/write" iconName="Plus" aria-label="plus" />
						<BottomNavItem href="/bookmark" iconName="Route" label="route" />
						<BottomNavItem href="/mypage" iconName="My" label="my" />
					</BottomNav>
				</section>
			</div>
		</div>
	);
}
