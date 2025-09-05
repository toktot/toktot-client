'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { mealOptions } from '@/entities/home/model/mockMealOptions';
import { Store } from '@/entities/store/model/mockStore';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { HomeAppShell } from '@/widgets/layout/ui/HomeAppShell';

import FilterBar from '@/features/home/components/FilterBar';
import { Review } from '@/features/home/model/mockHome';
import { priceSummaryMap } from '@/features/home/model/mockPriceSummary';

import HeaderBox from '@/shared/components/HeaderBox';
import SearchBox from '@/shared/components/SearchBox';
import StoreInfoCard from '@/shared/components/StoreCard';
import Toast from '@/shared/components/Toast';
import Icon from '@/shared/ui/Icon';
import { getDecryptedToken } from '@/shared/utils/storage';

import api from '../lib/api';
import PriceSummary from './PriceSummary';
import ReviewStoreCard from './ReviewStoreCard';

interface BackendReview {
	id: number;
	author: {
		id: number;
		nickname: string;
		profileImageUrl: string | null;
		reviewCount: number;
		averageRating: number;
	};
	isBookmarked: boolean;
	isWriter: boolean;
	overallRating: number;
	createdAt: string;
	keywords: string[];
	images: {
		id: string;
		imageUrl: string;
		thumbnailUrl: string;
	}[];
	restaurant: {
		id: number;
		name: string;
		address: string;
	};
}

interface BackendPlace {
	id: number | null;

	name: string | null;
	address: string | null;
	distance?: string | null;
	main_menus?: string[] | null;
	average_rating?: number | null;
	is_good_price_store?: boolean | null;
	is_local_store?: boolean | null;
	image?: string | null;
	point?: number | null;
	percent?: string | null;
	review_count?: number | null;
}

function toReview(api: BackendReview): Review {
	return {
		id: api.id,
		imageUrl: api.images?.[0]?.thumbnailUrl ?? '',
		placeName: api.restaurant?.name ?? 'Unknown Place',
		distance: '234m',

		location: api.restaurant?.address ?? '',
		rating: api.overallRating ?? 0, // 별점 정보 없으므로 기본값
		writer: api.author?.nickname ?? '익명',
		userProfileImageUrl: api.author?.profileImageUrl ?? '',
		time: api.createdAt ?? '',
		keywords: api.keywords ?? [],
		isBookmarked: api.isBookmarked ?? false,
	};
}
function toStore(api: BackendPlace): Store {
	let parsedMenus: string[] = [];

	if (typeof api.main_menus === 'string') {
		try {
			const obj = JSON.parse(api.main_menus);
			if (obj.firstMenu) {
				parsedMenus = [obj.firstMenu.trim()]; // ✅ firstMenu만
			}
		} catch {
			parsedMenus = [];
		}
	} else if (Array.isArray(api.main_menus)) {
		parsedMenus = api.main_menus;
	}

	return {
		id: api.id ?? 0,
		storeName: api.name ?? 'Unknown Store',
		address: api.address ?? '',
		distance: api.distance ?? '0',
		mainMenus: parsedMenus,
		rating: api.average_rating ?? 0,
		isKindStore: api.is_good_price_store ?? false,
		storeImageUrl: api.image ?? '/images/foodImage1.png',
		valueScore: api.point ?? 80,
		topPercent: api.percent ?? '20',
		reviewCount: api.review_count ?? 0,
	};
}

interface ReviewSearchBody {
	query: string;
	page: number;

	sort?: string;
	location?: {
		latitude: number;
		longitude: number;
		radius: number;
	};
	rating?: {
		min: number;
	};
	mealTime?: string;
	localFood?: {
		type: string;
		minPrice?: number;
		maxPrice?: number;
	};
	keywords?: string[];
}

export interface LocationFilter {
	latitude: number;
	longitude: number;
	radius: number;
}
export interface RatingFilter {
	min: number;
}
export interface LocalFoodFilter {
	type: string;
	minPrice?: number;
	maxPrice?: number;
}
export interface StoreSearchBody {
	query?: string;
	page: number;

	sort?: string;
	location?: LocationFilter;
	rating?: RatingFilter;
	mealTime?: string;
	localFood?: LocalFoodFilter;
	keywords?: string[];
}

export default function SearchResultSection() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const q = searchParams.get('q') ?? '';
	const [sortOption, setSortOption] = useState<
		'distance' | 'popularity' | 'RATING' | 'satisfaction'
	>('distance');
	const [inputValue, setInputValue] = useState(q);
	const [query, setQuery] = useState(q);
	const initialTab = searchParams.get('tab') as 'review' | 'store' | null;
	const [tab, setTab] = useState<'review' | 'store'>(initialTab ?? 'review');
	const [filter, setFilter] = useState<number | null>(null);
	const [filterSummary, setFilterSummary] = useState('');
	const [stores, setStores] = useState<Store[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const pageRef = useRef(1);

	const [reviews, setReviews] = useState<Review[]>([]);
	const [reviewPage, setReviewPage] = useState(1);
	const [hasMoreReviews, setHasMoreReviews] = useState(true);

	const fetchReviewCalledRef = useRef(false);

	console.log(filterSummary, loading, error);

	const handleReset = () => {
		setQuery('');
		setInputValue('');
	};
	const [hasMore, setHasMore] = useState(true);
	console.log(setError, hasMoreReviews, hasMore);
	useEffect(() => {
		const token = getDecryptedToken();
		if (!token) {
			router.replace('/login');
		}
	});

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
	const distance = searchParams.get('distance');
	const rating = Number(searchParams.get('rating') ?? 0);
	const mealTime = searchParams.get('mealTime');
	const menu = searchParams.get('menu');

	const fetchReviews = useCallback(async () => {
		if (!query || fetchReviewCalledRef.current) return;
		fetchReviewCalledRef.current = true;
		try {
			const body: ReviewSearchBody = {
				query,
				page: reviewPage,
			};
			const lat = searchParams.get('lat');
			const lng = searchParams.get('lng');
			if (lat && lng) {
				body.location = {
					latitude: Number(lat),
					longitude: Number(lng),
					radius: Number(distance) || 1000,
				};
			}
			if (rating) {
				body.rating = { min: rating };
			}
			if (mealTime) {
				body.mealTime = mealTime;
			}

			if (menu) {
				body.localFood = {
					type: menu,
					...(searchParams.get('minPrice')
						? { minPrice: Number(searchParams.get('minPrice')) }
						: {}),
					...(searchParams.get('maxPrice')
						? { maxPrice: Number(searchParams.get('maxPrice')) }
						: {}),
				};
			}
			const keywords = searchParams.getAll('keywords');
			if (keywords.length > 0) {
				body.keywords = keywords;
			}

			setLoading(true);

			console.log('요청 body', body);
			const res = await api.post('/v1/reviews/search', body);
			console.log('응답 데이터 :', res.data);
			console.log('fetchReviews', res);

			if (!res.data.data) return;
			const { content, totalElements } = res.data.data;
			const mappedReviews: Review[] = content.map(toReview);

			console.log('content', content);

			if (content) {
				setReviews((prev) => {
					const newReviews = mappedReviews.filter(
						(review) => !prev.find((r) => r.id === review.id),
					);
					return [...prev, ...newReviews];
				});
				setHasMoreReviews(
					reviews.length + mappedReviews.length < totalElements,
				);
			}
		} finally {
			setLoading(false);
			fetchReviewCalledRef.current = false;
		}
	}, [
		query,
		reviewPage,
		distance,
		mealTime,
		rating,
		menu,
		reviews.length,
		searchParams,
	]);

	const fetchStores = useCallback(async () => {
		if (!query) return;

		setLoading(true);

		try {
			const body: StoreSearchBody = {
				query,
				page: pageRef.current,
				sort: sortOption,
			};
			const lat = searchParams.get('lat');
			const lng = searchParams.get('lng');
			if (lat && lng) {
				body.location = {
					latitude: Number(lat),
					longitude: Number(lng),
					radius: Number(distance) || 1000,
				};
			}
			if (rating) {
				body.rating = { min: rating };
			}
			if (mealTime) {
				body.mealTime = mealTime;
			}
			if (menu) {
				body.localFood = {
					type: menu,
					...(searchParams.get('minPrice')
						? { minPrice: Number(searchParams.get('minPrice')) }
						: {}),
					...(searchParams.get('maxPrice')
						? { maxPrice: Number(searchParams.get('maxPrice')) }
						: {}),
				};
			}

			const keywords = searchParams.getAll('keywords');
			if (keywords.length > 0) {
				body.keywords = keywords;
			}
			const hasFilter = rating || menu || keywords.length > 0;
			console.log('요청 body:', body);
			const endpoint = hasFilter
				? '/v1/restaurants/search/filter'
				: '/v1/restaurants/search';

			const res = await api.post(endpoint, body);

			const { places, current_page, is_end } = res.data.data;
			console.log('places', res.data.data.places);
			console.log('res', places);
			if (!places || places.length == 0) {
				setHasMore(false);
				return;
			} else if (places) {
				setStores((prev) => {
					const newStores = places.map(toStore);
					const merged = [...prev, ...newStores];
					return merged.filter(
						(store, index, arr) =>
							arr.findIndex((s) => s.id === store.id) === index,
					);
				});

				pageRef.current = current_page + 1;
				if (is_end) setHasMore(false);
			}
		} finally {
			setLoading(false);
		}
	}, [query, searchParams, distance, rating, menu, mealTime, sortOption]);

	useEffect(() => {
		pageRef.current = 1;
		setStores([]);

		setReviews([]);

		fetchStores();
		fetchReviews();
	}, [fetchStores, fetchReviews]);

	useEffect(() => {
		if (tab === 'review') {
			fetchReviewCalledRef.current = false;
			fetchReviews();
		} else if (tab === 'store') {
			pageRef.current = 1;

			fetchStores();
		}
	}, [tab, fetchReviews, fetchStores]);

	const handleFilterChange = (newFilter: number | null) => {
		setFilter(newFilter);
		const params = new URLSearchParams(searchParams.toString());
		if (newFilter !== null) {
			params.set('filter', newFilter.toString());
		} else {
			params.delete('filter');
		}

		router.push(`/search?${params.toString()}`);
		pageRef.current = 1;
		setStores([]);
		setReviews([]);
		setReviewPage(1);
		setHasMore(true);
		setHasMoreReviews(true);

		fetchStores();
		fetchReviews();
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
		const mealTimeValue = searchParams.get('meal');
		if (mealTimeValue) {
			const selectedOption = mealOptions.find(
				(opt) => opt.value === Number(mealTimeValue),
			);
			if (selectedOption) summaryParts.push(selectedOption.label);
		}

		setFilterSummary(summaryParts.join(' '));
	}, [rating, searchParams]);

	return (
		<HomeAppShell showBottomNav={true}>
			<main className="flex flex-col h-screen">
				<HeaderBox onLocationSaved={handleLocationSaved} />
				<div className=" bg-white flex-1 overflow-y-auto scrollbar-hide">
					<div className="px-4 py-6">
						<section className="-mt-3 flex items-center gap-2">
							<Icon
								name={'ArrowLeft'}
								className=" text-grey-70 -ml-1"
								onClick={() => router.back()}
							/>
							{/* 검색창 */}
							<div className="min-w-[315px] max-w-[400px] w-full">
								<SearchBox
									query={inputValue}
									onChange={setInputValue}
									onSearchClick={() => {
										const params = new URLSearchParams(searchParams.toString());
										params.set('q', inputValue);
										params.delete('filter');
										router.push(`/search?${params.toString()}`);
										setQuery(inputValue);
										setFilter(null);

										pageRef.current = 1;
										setStores([]);
										setReviews([]);
										setReviewPage(1);
										setHasMore(true);
										setHasMoreReviews(true);

										fetchStores();
										fetchReviews();
									}}
									leftIcon={
										<Icon name="Search" size="s" className="text-grey-50" />
									}
									rightIcon={
										<Icon name="Cancel" size="s" className="text-grey-50" />
									}
									className="min-w-[315px] max-w-[400px] w-full h-[44px] flex items-start bg-grey-10 text-[14px] text-grey-90"
									rightIconOnClick={handleReset}
								/>
							</div>
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
					</div>

					{/* 리뷰 탭 콘텐츠 */}
					{tab === 'review' && (
						<>
							{/* 필터 바 */}
							<div className="px-4 -mt-2">
								<FilterBar
									value={filter}
									onChange={handleFilterChange}
									onSummaryChange={setFilterSummary}
									onClick={() =>
										router.push(
											`/searchDetection?from=search&q=${encodeURIComponent(query)}`,
										)
									}
									onSortChange={(newSort) => setSortOption(newSort)}
								/>
							</div>

							{priceSummary ? (
								// PriceSummary 있을 때
								<div className="bg-grey-10 mt-4 h-[800px] pt-2 pb-6 ">
									<div className="flex justify-center px-4">
										<PriceSummary {...priceSummary} />
									</div>
									{/* 리뷰 리스트 */}
									<div className="flex flex-wrap justify-between mt-4">
										{reviews.map((review) => (
											<ReviewStoreCard key={review.id} review={review} />
										))}
									</div>
								</div>
							) : (
								// PriceSummary 없을 때
								<div className="bg-white mt-4 w-full pt-0 pb-6">
									{/* 리뷰 리스트 */}
									<div className="flex flex-wrap justify-between">
										{reviews.map((review) => (
											<ReviewStoreCard key={review.id} review={review} />
										))}
									</div>
								</div>
							)}
						</>
					)}

					{/* 가게명 탭 콘텐츠 */}
					{tab === 'store' && (
						<>
							<div className="px-4 -mt-2">
								<FilterBar
									value={filter}
									onChange={handleFilterChange}
									onSummaryChange={setFilterSummary}
									onClick={() =>
										router.push(
											`/searchDetection?from=search&q=${encodeURIComponent(query)}`,
										)
									}
									onSortChange={(newSort) => setSortOption(newSort)}
								/>
							</div>
							<div className="mt-4 w-full flex flex-col">
								{stores
									.filter((store) => {
										const queryLower = query.toLowerCase();
										const nameMatch = store.storeName
											.toLowerCase()
											.includes(queryLower);
										const menuMatch = store.mainMenus.some((menu) =>
											menu.toLowerCase().includes(queryLower),
										);
										return nameMatch || menuMatch;
									})

									.map((store, index) => (
										<div
											key={store.id}
											className={`w-full ${
												index < stores.length - 1
													? 'border-b border-grey-10' // 얇은 회색 선
													: ''
											}`}
										>
											<StoreInfoCard review={store} />
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
				</div>
			</main>
		</HomeAppShell>
	);
}
