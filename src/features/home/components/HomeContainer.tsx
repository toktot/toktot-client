'use client';

import { useEffect, useMemo, useState } from 'react';

import { mockStores } from '@/entities/store/model/mockStore';
import { useRouter } from 'next/navigation';

import { BottomNav, BottomNavItem } from '@/widgets/layout';
import { CenterButton } from '@/widgets/layout/ui/BottomNav';

import HeaderBox from '@/shared/components/HeaderBox';
import SearchBox from '@/shared/components/SearchBox';
import StoreInfoCard, {
	StoreInfoCardProps,
} from '@/shared/components/StoreCard';
import Toast from '@/shared/components/Toast';
import Icon from '@/shared/ui/Icon';
import SingleCategorySelect from '@/shared/ui/SingleCategorySelect';

import { mockAlarmText } from '../model/mockAlarm';
import { mockHome } from '../model/mockHome';
import CategoryGrid from './FoodIcon';
import ReviewStoreCard from './ReviewStoreCard';
import AlarmBox from './alarmBox';

export default function HomeContainer() {
	const [query, setQuery] = useState('');
	const [tab, setTab] = useState<number>(0);
	const router = useRouter();
	const [showToast, setShowToast] = useState(false);
	const handleSearchClick = () => {
		console.log('검색어', query);
	};
	const filteredReviews = useMemo(
		() =>
			mockHome.filter((r) =>
				r.placeName.toLowerCase().includes(query.toLowerCase()),
			),
		[query],
	);
	const handleLocationSaved = () => {
		setShowToast(true);
	};
	useEffect(() => {
		router.prefetch('/searchBar');
	}, [router]);

	const filteredStores = useMemo(
		() =>
			mockStores.filter((s) =>
				s.storeName.toLowerCase().includes(query.toLowerCase()),
			),
		[query],
	);
	const handleToastClose = () => {
		setShowToast(false);
	};
	const [alarm] = useState(mockAlarmText[0]);
	return (
		<main className="min-h-screen">
			<div className="bg-grey-10">
				<HeaderBox onLocationSaved={handleLocationSaved} />
				<section className="relative mt-2 justify-center flex items-center gap-2">
					<div className="rounded-[18px] bg-gradient-to-r from-[#171D29] via-[#3AC8FF] to-[#2295C0] p-[2px]">
						<div className="w-[351px] h-[48px] rounded-[16px] bg-gradient-to-r from-[#F6FCFF] to-[#F9FCFF] flex items-center">
							<SearchBox
								query={query}
								onChange={setQuery}
								onClick={() => router.push('/searchBar')}
								onSearchClick={handleSearchClick}
								leftIcon={
									<Icon name="Search" size="s" className="text-primary-40" />
								}
								className="w-[351px] h-[48px] flex items-center"
								placeholder="제주도 여행가서 먹고 싶은 음식은?"
								placeholderColor="placeholder-primary-60"
							/>
						</div>
					</div>
				</section>
				<AlarmBox alarmText={alarm.text} />
				<section className="mt-6 px-4">
					<CategoryGrid />
				</section>
			</div>
			<section className="mt-8 px-4">
				<div className="flex items-center justify-between mb-3">
					<h2 className="text-base font-semibold text-grey-90 text-[18px]">
						최근에 사람들이 방문한 가게들이에요!
					</h2>
					<button className="text-[14px] text-grey-70">더보기</button>
				</div>

				<SingleCategorySelect
					value={tab}
					onChange={setTab}
					className="mb-4 flex-wrap"
				>
					<SingleCategorySelect.Item
						value={0}
						className={
							tab === 0 ? 'text-white bg-grey-90' : 'bg-grey-10 text-grey-60'
						}
					>
						리뷰
					</SingleCategorySelect.Item>
					<SingleCategorySelect.Item value={1}>가게</SingleCategorySelect.Item>
				</SingleCategorySelect>

				{tab === 0 ? (
					<div className="flex flex-wrap justify-between">
						{filteredReviews.map((review) => (
							<ReviewStoreCard key={review.id} review={review} />
						))}
						{filteredReviews.length === 0 && (
							<p className="text-sm text-gray-400 w-full py-10 text-center">
								해당 검색어로 작성된 리뷰가 없어요.
							</p>
						)}
					</div>
				) : (
					<div className="flex flex-col gap-4">
						{filteredStores.map((store) => {
							const mappedReview: StoreInfoCardProps['review'] = {
								id: String(store.id), // number → string
								storeImageUrl: store.storeImageUrl,
								storeName: store.storeName,
								isKindStore: store.isKindStore,
								mainMenus:
									store.mainMenus ?? (store.mainMenu ? [store.mainMenu] : []), // 배열 보장
								reviewCount: store.reviewCount ?? 0,
								valueScore: store.valueScore ?? 0,
								topPercent: store.topPercent ?? 0,
								address: store.address,
								rating: store.rating ?? store.ratingNumber ?? 0, // number 보장
								distance: store.distance,
							};
							return <StoreInfoCard key={store.id} review={mappedReview} />;
						})}
						{filteredStores.length === 0 && (
							<p className="text-sm text-gray-400 w-full py-10 text-center">
								해당 검색어와 일치하는 가게가 없어요.
							</p>
						)}
					</div>
				)}
				{showToast && (
					<Toast
						message="위치가 설정되었어요."
						duration={2000}
						onClose={handleToastClose}
					/>
				)}
			</section>

			<section>
				<BottomNav>
					<BottomNavItem href="/home" iconName="Home" label="home" />
					<BottomNavItem href="/review" iconName="Review" label="review" />
					<CenterButton href="/write" iconName="Plus" aria-label="plus" />
					<BottomNavItem href="/bookmark" iconName="Route" label="route" />
					<BottomNavItem href="/mypage" iconName="My" label="my" />
				</BottomNav>
			</section>
		</main>
	);
}
