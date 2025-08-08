'use client';

import { useMemo, useState } from 'react';

import { mockStores } from '@/entities/store/model/mockStore';
import { useRouter } from 'next/navigation';

import { BottomNav, BottomNavItem } from '@/widgets/layout';
import { CenterButton } from '@/widgets/layout/ui/BottomNav';

import HeaderBox from '@/shared/components/HeaderBox';
import SearchBox from '@/shared/components/SearchBox';
import StoreInfoCard from '@/shared/components/StoreCard';
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

	const filteredStores = useMemo(
		() =>
			mockStores.filter((s) =>
				s.storeName.toLowerCase().includes(query.toLowerCase()),
			),
		[query],
	);
	const [alarm] = useState(mockAlarmText[0]);
	return (
		<main className="min-h-screen bg-white">
			<HeaderBox />
			<section className="mt-2 flex items-center gap-2">
				<Icon name={'ArrowLeft'} className="w-5 h-5 text-gray-600" />
				<div className="p-[1/2px] rounded-[18px] border border-[linear-gradient(30deg,#171D29,#3AC8FF,#2295C0)]">
					<div className="rounded-[10px] bg-gradient-to-r from-[#E9FCFF] to-[#F6FCFF]"></div>
					<SearchBox
						query={query}
						onChange={setQuery}
						onFocus={() => router.push('/searchBar')}
						onSearchClick={handleSearchClick}
						className="text-primary-40 placeholder-primary-40 bg-transparent mr-1"
						placeholder="제주도 여행가서 먹고 싶은 음식은?"
					/>
				</div>
			</section>
			<AlarmBox alarmText={alarm.text} />
			<section className="mt-6 px-4">
				<CategoryGrid />
			</section>
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
						{filteredStores.map((store) => (
							<StoreInfoCard key={store.id} review={store} />
						))}
						{filteredStores.length === 0 && (
							<p className="text-sm text-gray-400 w-full py-10 text-center">
								해당 검색어와 일치하는 가게가 없어요.
							</p>
						)}
					</div>
				)}
			</section>
			<section>
				<BottomNav>
					<BottomNavItem href="/home" iconName="Home" label="홈" />
					<BottomNavItem href="/review" iconName="Review" label="리뷰" />
					<CenterButton
						href="/write"
						iconName="ReviewPlus"
						aria-label="작성하기"
					/>
					<BottomNavItem href="/bookmark" iconName="Bookmark" label="찜" />
					<BottomNavItem href="/mypage" iconName="My" label="마이페이지" />
				</BottomNav>
			</section>
		</main>
	);
}
