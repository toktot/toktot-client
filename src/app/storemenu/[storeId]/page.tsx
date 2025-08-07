'use client';

import { useMemo, useState } from 'react';

import clsx from 'clsx';
import { useParams } from 'next/navigation';

import { CopyButton } from '@/features/StoreDetail/components/Copy';
import StoreHome from '@/features/StoreDetail/components/[storeId]/StoreHome';
import StoreMenuSection from '@/features/StoreDetail/components/[storeId]/StoreMenu';
import StoreReview from '@/features/StoreDetail/components/[storeId]/StoreReview';
import { mockHome } from '@/features/home/model/mockHome';

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
		return mockHome.find((s) => s.id === Number(storeId));
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
					backgroundImage: `url('${store.imageUrl ?? '/images/default.jpg'}')`,
				}}
			>
				<div className="absolute bottom-4 left-4 text-white">
					<h1 className="text-3xl font-bold">{store.placeName}</h1>
					<div className="flex flex-wrap gap-2 mt-2">
						{store.moods?.map((mood) => (
							<span
								key={mood}
								className="bg-black/40 backdrop-blur px-3 py-1 rounded-full text-sm"
							>
								{mood}
							</span>
						))}
					</div>
				</div>
			</div>

			<BottomSheet open>
				<BottomSheetContent className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-4 max-h-[90vh] overflow-y-auto">
					<div className="relative z-10 -mt-10 bg-white rounded-t-3xl p-6 shadow-md">
						<div className=" flex items-center mt-3 mb-2">
							<Icon name={'Location'} className="mr-2 w-5 h-5 text-grey-50" />
							<span className="text-grey-80 text-base text-[14px]">
								{store.location}
							</span>
							<CopyButton text={store.location} />
						</div>
						{store.startTime && store.endTime && (
							<div className="flex items-center mb-2">
								<Icon name={'Time'} className="mr-2 w-5 h-5 text-grey-50" />
								<span className="text-green-500 text-[14px] font-semibold">
									영업중
								</span>
								<span className="text-grey-80 text-[14px] ml-1">
									{store.endTime}까지
								</span>
								<button>
									<Icon name={'ArrowUp'} className="text-grey-40 w-5 ml-1" />
								</button>
							</div>
						)}

						{store.phoneNumber && (
							<div className="flex items-center mb-2">
								<Icon name={'call'} className="mr-2 w-5 h-5 text-grey-50" />
								<span className="text-grey-80 text-[14px]">
									{store.phoneNumber}
								</span>
								<CopyButton text={store.phoneNumber} />
							</div>
						)}
						<div className="flex gap-6 mt-6 border-b border-grey-20">
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
						<div className="mt-4">
							{tab === 'home' && <StoreHome />}
							{tab === 'menu' && (
								<div className="text-gray-700">
									<div className="h-[10px] bg-grey-10 w-full" />
									<StoreMenuSection />
								</div>
							)}
							{tab === 'review' && (
								<div className="text-gray-700">
									<StoreReview />
								</div>
							)}
						</div>
					</div>
				</BottomSheetContent>
			</BottomSheet>
		</div>
	);
}
