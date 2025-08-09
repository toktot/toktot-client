'use client';

import { useEffect, useMemo, useState } from 'react';

import { Store, mockStores } from '@/entities/store/model/mockStore';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { BottomNav, BottomNavItem } from '@/widgets/layout';
import { CenterButton } from '@/widgets/layout/ui/BottomNav';

import FilterBar from '@/features/home/components/FilterBar';
import { mockHome } from '@/features/home/model/mockHome';
import { Review } from '@/features/home/model/mockHome';
import { priceSummaryMap } from '@/features/home/model/mockPriceSummary';

import HeaderBox from '@/shared/components/HeaderBox';
import SearchBox from '@/shared/components/SearchBox';
import StoreInfoCard from '@/shared/components/StoreCard';
import Icon from '@/shared/ui/Icon';

import PriceSummary from './PriceSummary';
import ReviewStoreCard from './ReviewStoreCard';

export default function SearchResultSection() {
	const searchParams = useSearchParams();
	const q = searchParams.get('q') ?? '';

	const [query, setQuery] = useState(q);
	const [tab, setTab] = useState<'review' | 'store'>('review');
	const [filter, setFilter] = useState<number | null>(null);
	const [filterSummary, setFilterSummary] = useState('');
	console.log(filterSummary);

	useEffect(() => {
		setQuery(q);
		setTab('review');
	}, [q]);

	// 가격 정보 가져오기
	const priceSummary = useMemo(() => {
		return priceSummaryMap[query as keyof typeof priceSummaryMap];
	}, [query]);

	// 리뷰 필터링
	const router = useRouter();
	const rating = Number(searchParams.get('rating') ?? 0);
	const mealTime = searchParams.get('mealTime');
	const menu = searchParams.get('menu');
	const detailFilters = useMemo(() => {
		const detailCategories = [
			'price',
			'food',
			'service',
			'clean',
			'mood',
			'parking',
		] as const;
		const filters: Record<string, number[]> = {};

		detailCategories.forEach((cat) => {
			const raw = searchParams.get(cat);
			if (raw) {
				filters[cat] = raw.split(',').map(Number);
			} else {
				filters[cat] = [];
			}
		});

		return filters;
	}, [searchParams]);

	const distance = searchParams.get('distance');
	const categoryKeyMap = useMemo(
		() => ({
			price: 'price',
			food: 'foodO',
			service: 'service',
			cleanliness: 'clean',
			mood: 'mood',
			parking: 'parking',
		}),
		[],
	);

	function parseDistance(distanceStr: string): number {
		if (!distanceStr) return 0;

		const lower = distanceStr.toLowerCase();

		// 숫자 부분만 추출 (정규식)
		const numMatch = lower.match(/[\d\.]+/);
		if (!numMatch) return 0;

		const num = parseFloat(numMatch[0]);
		if (lower.includes('km')) {
			return num * 1000; // km → m 변환
		}
		// 기본 단위는 m
		return num;
	}

	const filteredReviews = useMemo(() => {
		return mockHome.filter((r) => {
			if (distance && parseDistance(r.distance) > Number(distance))
				return false;
			if (rating && (r.rating ?? 0) < rating) return false;
			if (mealTime && r.mealTime !== mealTime) return false;
			if (menu && r.mainMenu !== menu) return false;
			for (const [category, selectedOptions] of Object.entries(detailFilters)) {
				if (selectedOptions.length === 0) continue;
				const key = categoryKeyMap[category as keyof typeof categoryKeyMap];
				const reviewOptions = r[key as keyof Review] as number[] | undefined; // 예: r.price, r.food 등, 데이터 구조에 따라 조정 필요
				console.log(reviewOptions);
				if (!reviewOptions) return false;
				if (!selectedOptions.every((opt) => reviewOptions.includes(opt)))
					return false;
			}
			return r.placeName.includes(query);
		});
	}, [query, rating, mealTime, distance, menu, detailFilters, categoryKeyMap]);
	const filteredStores = useMemo(() => {
		return mockStores.filter((s) => {
			if (distance && Number(s.distance) > Number(distance)) return false;
			if (rating && s.rating < rating) return false;
			if (mealTime && s.mealTime !== mealTime) return false;
			if (menu && s.mainMenu !== menu) return false;
			for (const [category, selectedOptions] of Object.entries(detailFilters)) {
				if (selectedOptions.length === 0) continue;
				const key = categoryKeyMap[category as keyof typeof categoryKeyMap];
				const reviewOptions = s[key as keyof Store] as number[] | undefined; // 예: r.price, r.food 등, 데이터 구조에 따라 조정 필요
				console.log(reviewOptions);
				if (!reviewOptions) return false;
				if (!selectedOptions.every((opt) => reviewOptions.includes(opt)))
					return false;
			}

			return s.storeName.toLowerCase().includes(query.toLowerCase());
		});
	}, [query, rating, mealTime, distance, menu, categoryKeyMap, detailFilters]);

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
	useEffect(() => {
		const summaryParts: string[] = [];
		if (searchParams.get('distance'))
			summaryParts.push(`${searchParams.get('distance')}m 이내`);
		if (rating) summaryParts.push(`${rating}점 이상`);
		if (searchParams.get('category'))
			summaryParts.push(searchParams.get('category')!);
		if (searchParams.get('minPrice') && searchParams.get('maxPrice')) {
			summaryParts.push(
				`${searchParams.get('minPrice')} ~ ${searchParams.get('maxPrice')}만원`,
			);
		}

		setFilterSummary(summaryParts.join(' '));
	}, [rating, searchParams]);

	return (
		<div className="px-4 py-6 bg-white">
			<HeaderBox />
			<section className="mt-2 flex items-center gap-2">
				<Icon name={'ArrowLeft'} className="w-5 h-5 text-gray-600" />
				{/* 검색창 */}
				<SearchBox
					query={query}
					onChange={setQuery}
					onSearchClick={() => console.log('search', query)}
				/>
			</section>
			{/* 탭 (리뷰 / 가게명) */}
			<div className="flex gap-6 mt-6 border-b border-gray-100">
				<button
					className={`pb-2 text-base font-semibold ${
						tab === 'review'
							? 'text-gray-900 border-b-2 border-gray-900'
							: 'text-gray-400'
					}`}
					onClick={() => setTab('review')}
				>
					리뷰
				</button>
				<button
					className={`pb-2 text-base font-semibold ${
						tab === 'store'
							? 'text-gray-900 border-b-2 border-gray-900'
							: 'text-gray-400'
					}`}
					onClick={() => setTab('store')}
				>
					가게명
				</button>
			</div>

			{/* 리뷰 탭 콘텐츠 */}
			{tab === 'review' && (
				<>
					{/* 필터 바 */}
					<div className="mt-4">
						<FilterBar
							value={filter}
							onChange={handleFilterChange}
							onSummaryChange={setFilterSummary}
						/>
					</div>

					{/* 가격 요약 */}
					{priceSummary && (
						<div className="mt-4">
							<PriceSummary {...priceSummary} />
						</div>
					)}

					{/* 리뷰 리스트 */}
					<div className="mt-4 flex flex-wrap justify-between gap-y-4">
						{filteredReviews.map((review) => (
							<ReviewStoreCard key={review.id} review={review} />
						))}
					</div>
				</>
			)}

			{/* 가게명 탭 콘텐츠 */}
			{tab === 'store' && (
				<>
					<div className="mt-4">
						<FilterBar
							value={filter}
							onChange={handleFilterChange}
							onSummaryChange={setFilterSummary}
						/>
					</div>
					<div className="mt-4 flex flex-wrap justify-between gap-y-4"></div>
					{filteredStores.map((store) => (
						<StoreInfoCard key={store.id} review={store} />
					))}
				</>
			)}
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
		</div>
	);
}
