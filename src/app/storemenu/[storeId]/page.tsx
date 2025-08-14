'use client';

import { useMemo, useState } from 'react';

import { PLACE_MOOD_KEYWORDS } from '@/entities/store/model/constants';
import { mockStores } from '@/entities/store/model/mockStore';
import clsx from 'clsx';
import { useParams } from 'next/navigation';

import { BottomNav, BottomNavItem } from '@/widgets/layout';
import { CenterButton } from '@/widgets/layout/ui/BottomNav';

import { CopyButton } from '@/features/StoreDetail/components/Copy';
import StoreHome from '@/features/StoreDetail/components/[storeId]/StoreHome';
import StoreMenuSection from '@/features/StoreDetail/components/[storeId]/StoreMenu';
import StoreReview from '@/features/StoreDetail/components/[storeId]/StoreReview';

import {
	BottomSheet,
	BottomSheetContent,
} from '@/shared/components/BottomSheet';
import Icon from '@/shared/ui/Icon';

export default function StoreDetailPage() {
	const params = useParams();

	const storeId = params.storeId as string;

	// 단일 Review 객체 추출
	const store = useMemo(() => {
		return mockStores.find((s) => s.id === storeId);
	}, [storeId]);
	console.log(store);

	const [tab, setTab] = useState<'home' | 'menu' | 'review'>('home');

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
					backgroundImage: `url('${store.storeImageUrl ?? '/images/default.jpg'}')`,
				}}
			>
				<Icon
					name={'Etc'}
					className="absolute top-2 right-2 transform rotate-90 text-white"
				/>
				<div className="absolute bottom-4 left-4 text-white">
					<div className="flex flex-wrap items-center gap-2 mb-4">
						<h1 className="text-[20px] font-bold">{store.storeName}</h1>
						<div className="">
							{store.moods?.map((mood) => {
								// PLACE_MOOD_KEYWORDS에서 label과 일치하는지 확인
								const matched = PLACE_MOOD_KEYWORDS.find(
									(keyword) => keyword.label === mood,
								);
								if (!matched) return null;

								return (
									<span
										key={mood}
										className={`px-3 py-1 rounded-full text-sm ${
											matched.activeClassName
												? matched.activeClassName
												: 'bg-black/40'
										}`}
										style={{
											color: matched.iconFillColor
												? matched.iconFillColor
												: undefined,
										}}
									>
										{mood}
									</span>
								);
							})}
						</div>
					</div>
				</div>
			</div>

			<BottomSheet open>
				<BottomSheetContent className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[65vh] overflow-y-auto">
					<div className="px-6">
						<div className=" flex items-center mt-5 gap-2 mb-1">
							<Icon name={'Location'} className="mr-2 w-5 h-5 text-grey-50" />
							<span className="text-grey-80 text-base text-[14px]">
								{store.address}
							</span>
							<CopyButton text={store.address} />
						</div>
						{store.startTime && store.endTime && (
							<div className="flex items-center gap-2 mb-2">
								<Icon name={'Time'} className="mr-2 w-5 h-5 text-grey-50" />
								<span className="text-green-500 text-[14px] font-semibold">
									영업중
								</span>
								<span className="text-grey-80 text-[14px] ml-1">
									{store.endTime}까지
								</span>
								<button>
									<Icon
										name={'ArrowUp'}
										size="xs"
										className="text-grey-40 w-5 ml-1"
									/>
								</button>
							</div>
						)}

						{store.phoneNumber && (
							<div className="flex items-center gap-2 mb-2">
								<Icon name={'call'} className="mr-2 w-5 h-5 text-grey-50" />
								<span className="text-grey-80 text-[14px]">
									{store.phoneNumber}
								</span>
								<CopyButton text={store.phoneNumber} />
							</div>
						)}
						<div className="flex gap-10 mt-6 border-b border-grey-20">
							{['home', 'menu', 'review'].map((t) => (
								<button
									key={t}
									className={clsx(
										'pb-2 text-base font-semibold transition-colors',
										tab === t
											? 'text-grey-90 border-b-2 border-grey-90'
											: 'text-grey-40',
									)}
									onClick={() => setTab(t as typeof tab)}
								>
									{t === 'home' ? '홈' : t === 'menu' ? '메뉴' : '리뷰'}
								</button>
							))}
						</div>
					</div>

					<div>
						{tab === 'home' && (
							<div className="bg-grey-10 w-full">
								<StoreHome />
							</div>
						)}
						{tab === 'menu' && (
							<div className="text-gray-700">
								<div className="h-[0.5px] bg-grey-10 w-full" />
								<StoreMenuSection />
							</div>
						)}
						{tab === 'review' && (
							<div className="text-gray-700">
								<StoreReview />
							</div>
						)}
					</div>
					<div className="relative z-10 -mt-8 pt-[100px] bg-grey-10 px-6 pb-10">
						<section>
							<BottomNav>
								<BottomNavItem
									href="/home"
									iconName="Home"
									label="home"
									foreActive
								/>
								<BottomNavItem
									href="/review"
									iconName="Review"
									label="review"
								/>
								<CenterButton href="/write" iconName="Plus" aria-label="plus" />
								<BottomNavItem
									href="/bookmark"
									iconName="Route"
									label="route"
								/>
								<BottomNavItem href="/mypage" iconName="My" label="my" />
							</BottomNav>
						</section>
					</div>
				</BottomSheetContent>
			</BottomSheet>
		</div>
	);
}
