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
import Toast from '@/shared/components/Toast';
import Icon from '@/shared/ui/Icon';
import { getDecryptedToken } from '@/shared/utils/storage';

import PriceSummary from './PriceSummary';
import ReviewStoreCard from './ReviewStoreCard';

interface Stores {
	id: string;
	external_kakao_id: string;
	name: string;
	address: string;
	distance: string;
	main_menus: string[];
	average_rating: number;
	is_good_price_store: boolean;
	image: string;
	point: number;
	percent: number;
	reviewCount?: number;
}
interface BackendPlace {
	id?: string | null;
	external_kakao_id: string | number;
	name: string | null;
	address: string | null;
	distance?: string | null;
	main_menus?: string[] | null;
	average_rating?: number | null;
	is_good_price_store?: boolean | null;
	image?: string | null;
	point?: number | null;
	percent?: number | null;
	reviewCount?: number | null;
}

export default function SearchResultSection() {
	const searchParams = useSearchParams();
	const q = searchParams.get('q') ?? '';

	const [query, setQuery] = useState(q);
	const [tab, setTab] = useState<'review' | 'store'>('review');
	const [filter, setFilter] = useState<number | null>(null);
	const [filterSummary, setFilterSummary] = useState('');
	const [stores, setStores] = useState<Stores[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	console.log(loading, error);

	const [page, setPage] = useState(1);

	console.log(filterSummary);
	const handleReset = () => {
		setQuery('');
	};
	const [hasMore, setHasMore] = useState(true);

	useEffect(() => {
		setQuery(q);
		setStores([]);
		setPage(1);
		setHasMore(true);
		setError(null);
	}, [q]);

	// 가격 정보 가져오기
	const priceSummary = useMemo(() => {
		return priceSummaryMap[query as keyof typeof priceSummaryMap];
	}, [query]);
	const [showToast, setShowToast] = useState(false);
	const handleLocationSaved = () => {
		setShowToast(true);
	};

	const handleToastClose = () => {
		setShowToast(false);
	};
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

	useEffect(() => {
		if (!q || !hasMore) return;
		const fetchStores = async () => {
			setLoading(true);
			console.log('로딩중');
			try {
				const token = getDecryptedToken();
				const res = await fetch(
					'https://api.toktot.site/v1/restaurants/search',
					{
						method: 'POST',
						headers: {
							Authorization: `Bearer ${token}`,
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ query: q, page }),
					},
				);

				const json = await res.json();
				console.log('json', json);
				if (!json.success || !json.data) {
					console.error('API Error Response', json);
					throw new Error(
						json.message || 'Failed to fetch data from the server.',
					);
				}
				const { places, is_end } = json.data;
				if (!places || places.length == 0) {
					setHasMore(false);
					return;
				}

				const newStores: Stores[] = places.map((place: BackendPlace) => ({
					id: String(place.external_kakao_id),
					external_kakao_id: String(place.external_kakao_id),
					name: place.name ?? 'Unknown Store',
					address: place.address ?? '',
					distance: place.distance ?? '0',
					main_menus: place.main_menus ?? [],
					average_rating: place.average_rating ?? 0,
					is_good_price_store: place.is_good_price_store ?? false,
					image: place.image ?? '/default.png',
					point: place.point ?? 0,
					percent: place.percent ?? 0,
					reviewCount: place.reviewCount ?? 0,
				}));

				setStores((prev) => [...prev, ...newStores]);
				setHasMore(!is_end);
			} catch (err) {
				console.error(err);
				setHasMore(false);
			} finally {
				setLoading(false);
			}
		};

		fetchStores();
	}, [q, page, hasMore]); // fetchStores 제거

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
			<HeaderBox onLocationSaved={handleLocationSaved} />
			<section className="mt-2 flex items-center gap-2">
				<Icon
					name={'ArrowLeft'}
					className="w-5 h-5 text-gray-600"
					onClick={() => router.back()}
				/>
				{/* 검색창 */}

				<SearchBox
					query={query}
					onChange={setQuery}
					onSearchClick={() => {
						const params = new URLSearchParams();
						params.set('q', query);
						router.push(`/search?${params.toString()}`);
					}}
					leftIcon={<Icon name="Search" size="s" className="text-grey-50" />}
					rightIcon={<Icon name="Cancel" size="s" className="text-grey-50" />}
					className="max-w-[315px] h-[44px] flex items-start bg-grey-10 text-[14px] text-grey-90"
					rightIconOnClick={handleReset}
				/>
			</section>
			{/* 탭 (리뷰 / 가게명) */}
			<div className="flex mt-6 border-b border-gray-100 justify-center gap-x-40">
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
					<div className="mt-4 flex flex-wrap -mx-4 justify-between">
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
					<div className="mt-4 w-full flex flex-col">
						{stores.map((store, index) => (
							<div
								key={store.id}
								className={`w-full ${
									index < filteredStores.length - 1
										? 'border-b border-grey-10' // 얇은 회색 선
										: ''
								}`}
							>
								<StoreInfoCard
									review={{
										id: store.id,
										storeImageUrl: store.image ?? '/default.png',
										storeName: store.name,
										isKindStore: store.is_good_price_store ?? false,
										mainMenus: store.main_menus?.slice(0, 2) ?? [],
										reviewCount: store.reviewCount ?? 0,
										valueScore: store.point ?? 0,
										topPercent: store.percent ?? 0,
										address: store.address,
										rating: Number(store.average_rating ?? 0),
										distance: store.distance,
									}}
								/>
							</div>
						))}
					</div>
					{showToast && (
						<Toast
							message="위치가 설정되었어요."
							duration={2000}
							onClose={handleToastClose}
						/>
					)}
				</>
			)}
			<section>
				<BottomNav>
					<BottomNavItem href="/home" iconName="Home" label="home" />
					<BottomNavItem href="/review" iconName="Review" label="review" />
					<CenterButton href="/write" iconName="Plus" aria-label="plus" />
					<BottomNavItem href="/bookmark" iconName="Route" label="route" />
					<BottomNavItem href="/mypage" iconName="My" label="my" />
				</BottomNav>
			</section>
		</div>
	);
}
