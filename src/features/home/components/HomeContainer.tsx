'use client';

import { useEffect, useMemo, useState } from 'react';

import { mockReviews } from '@/entities/store/model/mockReview';
import { mockStores } from '@/entities/store/model/mockStore';

import { useRouter, useSearchParams } from 'next/navigation';


import HeaderBox from '@/shared/components/HeaderBox';
import SearchBox from '@/shared/components/SearchBox';
import StoreInfoCard from '@/shared/components/StoreCard';
import Toast from '@/shared/components/Toast';
import Icon from '@/shared/ui/Icon';
import { getDecryptedToken } from '@/shared/utils/storage';

import { mockHome } from '../model/mockHome';
import FilterBar from './FilterBar';
import CategoryGrid from './FoodIcon';
import PhotoReviewCard from './ReviewCardNew';
import AlarmBox from './alarmBox';
import PriceTabs from './homeStore';

export default function HomeContainer() {
	const searchParams = useSearchParams();

	const [filter, setFilter] = useState<number | null>(null);
	const [query, setQuery] = useState('');

	const router = useRouter();
	const [showToast, setShowToast] = useState(false);

	const handleSearchClick = () => {
		console.log('검색어', query);
	};
	const filteredReviews = useMemo(() => {
		return mockHome.filter((r) => {
			if (query && !r.placeName.toLowerCase().includes(query.toLowerCase()))
				return false;

			const distance = searchParams.get('distance');
			if (distance && parseFloat(r.distance) > Number(distance)) return false;

			// 별점 필터
			const rating = Number(searchParams.get('rating') ?? 0);
			if (rating && r.rating < rating) return false;

			// 식사 시간 필터
			const mealTime = searchParams.get('meal');
			if (mealTime && r.mealTime !== mealTime) return false;

			// 메뉴 필터
			const menu = searchParams.get('menu');
			if (menu && r.mainMenu !== menu) return false;

			// 기타 상세 필터
			const detailCategories = [
				'price',
				'food',
				'service',
				'clean',
				'mood',
				'parking',
			] as const;
			for (const cat of detailCategories) {
				const raw = searchParams.get(cat);
				if (!raw) continue;
				const selectedOptions = raw.split(',').map(Number);
				const reviewOptions = r[cat as keyof typeof r] as number[] | undefined;
				if (!reviewOptions) return false;
				if (!selectedOptions.every((opt) => reviewOptions.includes(opt)))
					return false;
			}
			return true;
		});
	}, [query, searchParams]);
	const mostPopularReview = useMemo(() => {
		if (mockReviews.length === 0) return [];

		const maxPopular = Math.max(...mockReviews.map((r) => r.popular || 0));

		// find 대신 filter를 사용해서 배열 반환
		return mockReviews.filter((r) => (r.popular || 0) === maxPopular);
	}, []);
	console.log(mostPopularReview, filteredReviews);
	const handleFilterChange = (newFilter: number | null) => {
		setFilter(newFilter);
		const params = new URLSearchParams(searchParams.toString());
		if (newFilter !== null) {
			params.set('filter', newFilter.toString());
		} else {
			params.delete('filter');
		}
		router.push(`/search?q=${query}&${params.toString()}`);
	};
	const handleLocationSaved = () => {
		setShowToast(true);
	};
	useEffect(() => {
		const token = getDecryptedToken();
		console.log('Token', token);
		console.log(token);
		if (!token) {
			router.replace('/login');
		}
	}, [router]);
	useEffect(() => {
		router.prefetch('/searchBar');
	}, [router]);

	const handleToastClose = () => {
		setShowToast(false);
	};
	const mappedReviews = mockHome.map((r) => {
		const matchedStore = mockStores.find((store) =>
			store.storeName.includes(r.placeName),
		);
		return {
			id: r.id,
			nickname: r.writer || '익명',
			profileImageUrl: '/images/default-profile.png',
			reviewCount: r.ratingNumber,
			averageRating: r.rating,
			gasimbi: r.gasimbi,
			image: r.imageUrl,
			menu: r.mainMenu ? [r.mainMenu] : [],
			date: r.time || '1분 전',
			mealTime: r.mealTime || '모름',
			rating: r.rating,
			text: r.text,
			placeName: matchedStore?.storeName,
		};
		// placeName을 리뷰 텍스트 대신 임시 사용
	});
	const toNumber = (d?: string) =>
		d != null ? parseFloat(d) : Number.POSITIVE_INFINITY;

	const sortedStores = [...mockStores].sort(
		(a, b) => toNumber(a.distance) - toNumber(b.distance),
	);

	return (
		<main className="flex flex-col h-screen">
			<HeaderBox onLocationSaved={handleLocationSaved} />
			<div className="flex-1 overflow-y-auto scrollbar-hide">
				<div className="bg-grey-10">
					<section className="relative mt-2 justify-center flex items-center gap-2 bg-grey-10">
						<div className="rounded-[18px] bg-gradient-to-r from-[#171D29] via-[#3AC8FF] to-[#2295C0] p-[2px]">
							<div className="w-full min-w-[351px] max-w-[480px]  h-[48px] rounded-[16px] bg-gradient-to-r from-[#F6FCFF] to-[#F9FCFF] flex items-center">
								<SearchBox
									query={query}
									onChange={setQuery}
									onClick={() => router.push('/searchBar')}
									onSearchClick={handleSearchClick}
									leftIcon={
										<Icon name="Search" size="s" className="text-primary-40" />
									}
									className=" h-[48px] flex items-center"
									placeholder="제주도 여행가서 먹고 싶은 음식은?"
									placeholderColor="placeholder-primary-60"
								/>
							</div>
						</div>
					</section>
					<AlarmBox />
					<section className="mt-3 px-4">
						<CategoryGrid />
					</section>
				</div>
				<section className="  bg-white px-4 py-4">
					{/* 상단 제목 + 더보기 */}
					<div className="flex items-center justify-between ">
						<h2 className="text-lg font-semibold text-[18px]">
							지금 가장 많이 저장된 후기 PICK!
						</h2>
						<button className="text-sm text-gray-500">더보기</button>
					</div>
					<div className="overflow-x-auto py-2 scrollbar-hide">
						<div className="inline-flex justify-start">
							<FilterBar
								value={filter}
								onChange={handleFilterChange}
								onClick={() => router.push('/searchDetection?from=home')}
							/>
						</div>
					</div>
					<div
						className="overflow-x-auto py-2 scrollbar-hide"
						style={{ WebkitOverflowScrolling: 'touch' }}
					>
						<div className="inline-flex gap-4">
							{mappedReviews.map((review) => (
								<div
									key={review.id}
									className="flex-shrink-0 w-[290px]"
									style={{ WebkitOverflowScrolling: 'touch' }}
								>
									<PhotoReviewCard review={review} stores={mockStores} />
								</div>
							))}
						</div>
					</div>

					{/* 가격 + 음식 필터 */}
					<div className="mt-8 flex items-center justify-between mb-4">
						<h2 className="text-[18px] font-semibold">
							가격도 착하고 맛까지 좋은 가게는?
						</h2>
						<button className="text-sm text-gray-500">더보기</button>
					</div>
					<PriceTabs />
					<div className="flex justify-center mt-5">
						<button className="min-w-[343px] max-w-[430px] w-full border border-grey-40 rounded-3xl text-grey-90 text-center py-2">
							더보기
						</button>
					</div>

					{/* PhotoReviewCard 목록 */}

					{/* 가격도 착하고 맛까지 좋은 가게 */}
					<div className="mt-8 flex items-center justify-between mb-4">
						<h2 className="text-[18px] font-semibold">
							지금 만나보는 가까운 식당
						</h2>
						<button className="text-sm text-gray-500">더보기</button>
					</div>

					{/* StoreInfoCard 목록 */}
					<div className="flex flex-col gap-4">
						{sortedStores.map((store) => (
							<StoreInfoCard key={store.id} review={store} />
						))}
					</div>
				</section>

				{/* Toast */}
				{showToast && (
					<Toast
						message="위치가 설정되었어요."
						duration={2000}
						onClose={handleToastClose}
					/>
				)}

			</div>

		</main>
	);
}
