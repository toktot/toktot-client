'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { mealOptions } from '@/entities/home/model/mockMealOptions';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { AppShell } from '@/widgets/layout';

import { Review } from '@/widgets/home/model/mockHome';
import FilterBar from '@/widgets/home/ui/FilterBar';
import Auto from '@/features/search-bar/ui/Auto';

import HeaderBox from '@/shared/components/HeaderBox';
import SearchBox from '@/shared/components/SearchBox';
import StoreInfoCard from '@/shared/components/StoreCard';
import Toast from '@/shared/components/Toast';
import { ICON_MAP, IconName } from '@/shared/icons/iconMap';
import { useCurrentLocation } from '@/shared/location/lib/useCurrentLocation';
import Icon from '@/shared/ui/Icon';
import { getDecryptedToken } from '@/shared/utils/storage';

import api from '../lib/api';
import PriceSummary from './PriceSummary';
import ReviewStoreCard from './ReviewStoreCard';

export interface BackendReview {
	id: number;
	authorNickname: string;
	mainImageUrl: string;
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
	id: number;

	name: string;
	address: string;
	distance?: string | null;
	main_menus?: string | null;
	average_rating?: number | null;
	is_good_price_store?: boolean | null;
	is_local_store?: boolean | null;
	image?: string | null;
	point?: number | null;
	percent?: string | null;
	review_count?: number | null;
}
interface FrontendPlace {
	id: number;
	name: string;
	address: string;
	distance: string;
	mainMenus?: string[];
	average_rating: number;
	is_good_price_store: boolean;
	image: string;
	valueScore: number;
	topPercent: string;
	review_count: number;
}

function toReview(api: BackendReview): Review {
	console.log('toReview api:', api.authorNickname);
	return {
		id: api.id,
		imageUrl: api.mainImageUrl ?? '',
		placeName: api.restaurant?.name ?? 'Unknown Place',
		distance: '234m',

		location: api.restaurant?.address ?? '',
		rating: api.overallRating ?? 0, // 별점 정보 없으므로 기본값
		writer: api.authorNickname,
		userProfileImageUrl: api.author?.profileImageUrl ?? '',
		time: api.createdAt ?? '',
		keywords: api.keywords ?? [],
		isBookmarked: api.isBookmarked ?? false,
	};
}
function toStore(api: Store | BackendPlace): FrontendPlace {
	let parsedMenus: string[] = [];
	if (typeof api.main_menus === 'string') {
		try {
			const obj = JSON.parse(api.main_menus);
			if (obj.firstMenu) {
				parsedMenus = [obj.firstMenu.trim()];
			}
		} catch {
			parsedMenus = [];
		}
	} else if (Array.isArray(api.main_menus)) {
		parsedMenus = api.main_menus;
	}

	return {
		id: api.id ?? 0,
		name: api.name,
		address: api.address,
		distance: api.distance ?? '0',
		mainMenus: parsedMenus ?? [],
		average_rating: api.average_rating ?? 0,
		is_good_price_store: api.is_good_price_store ?? false,
		image: api.image as string,
		valueScore: api.point ?? 80,
		topPercent: api.percent ?? '20',
		review_count: api.review_count ?? 0,
	};
}
export interface Store {
	id: number;
	name: string;
	distance: string;
	main_menus: string;
	average_rating: number;
	address: string;
	review_count: number;
	is_good_price_store: boolean;
	is_local_store: boolean;
	image: string;
	point: number;
	percent: string;
}

// 일반 검색 응답
interface NormalSearchResponse {
	data: {
		places: Store[];
		current_page: number;
		is_end: boolean;
	};
}

// 필터 검색 응답
interface FilterSearchResponse {
	data: {
		data: {
			content: Store[];
			pageable: {
				pageNumber: number;
			};
			last: boolean;
		};
		local_food_stats: unknown;
		is_local_food_search: boolean;
	};
}

// 둘 중 하나일 수 있음
type SearchResponse = NormalSearchResponse | FilterSearchResponse;

export interface ReviewSearchBody {
	query: string;
	page?: number;

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
	page?: number;

	sort?: string;
	location?: LocationFilter;
	rating?: RatingFilter;
	mealTime?: string;
	localFood?: LocalFoodFilter;
	keywords?: string[];
}
type LocalFoodStatsResponse = {
	success: boolean;
	data: {
		display_name: string;
		average_price: number;
		min_price: number;
		max_price: number;
	};
};
async function fetchLocalFoodStats(localFoodType: string) {
	console.log('API call start');
	const { data } = await api.get<LocalFoodStatsResponse>(
		`/v1/local-foods/${encodeURIComponent(localFoodType)}/stats`,
	);
	console.log('data.data', data.data);
	if (!data?.success) throw new Error('stats api failed');
	return data.data;
}
const MENU_TO_ENUM: Record<string, string> = {
	돔베고기: 'DOMBE_MEAT',
	고기국수: 'MEAT_NOODLE_SOUP',
	성게미역국: 'SEA_URCHIN_SEAWEED_SOUP',
	고사리해장국: 'BRACKEN_HANGOVER_SOUP',
	'고사리 해장국': 'BRACKEN_HANGOVER_SOUP',
	옥돔구이: 'GRILLED_RED_TILEFISH',
	갈치구이: 'GRILLED_CUTLASSFISH',
	회: 'RAW_FISH_MULHOE',
	'회/물회': 'RAW_FISH_MULHOE',
	빙떡: 'BING_RICE_CAKE',
	오메기떡: 'OMEGI_RICE_CAKE',
	흑돼지구이: 'BLACKPORK_BBQ',
	전복김밥: 'ABALONE_KIMBAP',
};

export default function SearchResultSection() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const q = searchParams.get('q') ?? '';
	const [sortOption, setSortOption] = useState<
		'DISTANCE' | 'POPULARITY' | 'RATING' | 'SATISFACTION'
	>('POPULARITY');
	const [inputValue, setInputValue] = useState(q);
	const [query, setQuery] = useState(q);
	const initialTab = searchParams.get('tab') as 'review' | 'store' | null;
	const [tab, setTab] = useState<'review' | 'store'>(initialTab ?? 'store');
	const [filter, setFilter] = useState<number | null>(null);
	const [, setFilterSummary] = useState('');
	const [stores, setStores] = useState<FrontendPlace[]>([]);
	const [, setLoading] = useState(true);
	const loaderRef = useRef<HTMLDivElement | null>(null);
	const fetchRef = useRef({ reviews: false, stores: false });
	const pageRef = useRef(1);
	const [text, setText] = useState('');

	const fetchingRef = useRef(false);
	const handleSelect = (selectedText: string) => {
		setInputValue(selectedText);
		setQuery(selectedText);

		setText('');
		pageRef.current = 1;
		setReviews([]);
		setStores([]);
		setHasMore(true);
		setHasMoreReviews(true);
		router.push(`/search?q=${encodeURIComponent(selectedText)}`);
	};
	// 메뉴명 → 아이콘(ICON_MAP에 실제 존재하는 키로 채우세요)
	const MENU_ICON_MAP: Partial<Record<string, IconName>> = {
		돔베고기: 'DombeGogi' as IconName,
		고기국수: 'RawFishSoup' as IconName,
		성게미역국: 'Seaweedsoup' as IconName,
		'고사리 해장국': 'Gosali' as IconName,
		옥돔구이: 'Ogdom' as IconName,
		갈치구이: 'Galchi' as IconName,
		회: 'RawFish' as IconName,
		'회/물회': 'RawFish' as IconName,
		빙떡: 'Bingtteok' as IconName,
		오메기떡: 'Omegitteok' as IconName,
		흑돼지구이: 'Pig' as IconName,
		전복김밥: 'Abalone' as IconName,
	};

	// enum → 아이콘
	const TYPE_ICON_MAP: Partial<Record<string, IconName>> = {
		DOMBE_MEAT: 'DombeGogi' as IconName,
		MEAT_NOODLE_SOUP: 'RawFishSoup' as IconName,
		SEA_URCHIN_SEAWEED_SOUP: 'Seaweedsoup' as IconName,
		BRACKEN_HANGOVER_SOUP: 'Gosali' as IconName,
		GRILLED_RED_TILEFISH: 'Ogdom' as IconName,
		GRILLED_CUTLASSFISH: 'Galchi' as IconName,
		RAW_FISH_MULHOE: 'RawFish' as IconName,
		BING_RICE_CAKE: 'Bingtteok' as IconName,
		OMEGI_RICE_CAKE: 'Omegitteok' as IconName,
		BLACKPORK_BBQ: 'Pig' as IconName, // 흑돼지구이
		ABALONE_KIMBAP: 'Abalone' as IconName,
	};

	// ICON_MAP에 실제로 있는 키만 허용 + 폴백
	function ensureIcon(
		icon: IconName | undefined,
		fallback: IconName = 'Food' as IconName,
	): IconName {
		if (icon && ICON_MAP[icon]) return icon;
		if (ICON_MAP[fallback]) return fallback;
		return Object.keys(ICON_MAP)[0] as IconName;
	}

	// ⬇️ “정확 매핑만” 사용 (키워드 없음)
	function pickIconByMenu(params: {
		menuName?: string;
		localFoodType?: string;
		fallback?: IconName;
	}): IconName {
		const { menuName, localFoodType, fallback = 'Food' as IconName } = params;

		if (menuName && MENU_ICON_MAP[menuName]) {
			const ic = MENU_ICON_MAP[menuName]!;
			console.log('[IconMap] by MENU_ICON_MAP:', menuName, '→', ic);
			return ensureIcon(ic, fallback);
		}

		if (localFoodType && TYPE_ICON_MAP[localFoodType]) {
			const ic = TYPE_ICON_MAP[localFoodType]!;
			console.log('[IconMap] by TYPE_ICON_MAP:', localFoodType, '→', ic);
			return ensureIcon(ic, fallback);
		}

		console.warn('[IconMap] fallback used for', { menuName, localFoodType });
		return ensureIcon(undefined, fallback);
	}

	const [reviews, setReviews] = useState<Review[]>([]);
	const [, setReviewPage] = useState(1);

	const [, setHasMoreReviews] = useState(true);

	const handleReset = () => {
		setQuery('');
		setInputValue('');
	};
	const [hasMore, setHasMore] = useState(true);
	const handleSortChange = (option: typeof sortOption) => {
		setSortOption(option); // FilterBar에서 변경된 값을 반영
	};
	useEffect(() => {
		const token = getDecryptedToken();
		if (!token) {
			router.replace('/login');
		}
	});

	// 가격 정보 가져오기
	const [priceSummary, setPriceSummary] = useState<{
		displayName: string;
		averagePrice: number;
		minPrice: number;
		maxPrice: number;
	} | null>(null);
	const [localFoodTypeForIcon, setLocalFoodTypeForIcon] = useState<
		string | undefined
	>(undefined);

	useEffect(() => {
		let mounted = true;

		(async () => {
			try {
				const localFoodType = MENU_TO_ENUM[query];
				setLocalFoodTypeForIcon(localFoodType);
				console.log(localFoodType);
				if (!localFoodType) {
					setPriceSummary(null);
					return;
				}

				const stats = await fetchLocalFoodStats(localFoodType);
				if (!mounted) return;

				setPriceSummary({
					displayName: stats.display_name || query,
					averagePrice: stats.average_price ?? 0,
					minPrice: stats.min_price ?? 0,
					maxPrice: stats.max_price ?? 0,
				});
			} catch (e) {
				if (mounted) setPriceSummary(null);
				console.error('price stats fetch error', e);
			}
		})();

		return () => {
			mounted = false;
		};
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
	const { location } = useCurrentLocation();

	const fetchReviews = useCallback(async () => {
		if (!query || fetchRef.current.reviews) return;
		fetchRef.current.reviews = true;
		try {
			const body: ReviewSearchBody = {
				query,

				sort: sortOption,
			};

			if (distance && location?.coords) {
				const lat = location?.coords?.latitude ?? 0;
				const lng = location?.coords?.longitude ?? 0;
				const radius = parseInt(distance, 10) || 1000;
				body.location = {
					latitude: Number(lat),
					longitude: Number(lng),
					radius,
				};
			}
			if (rating) {
				body.rating = { min: rating };
			}

			if (mealTime !== null) {
				// mealTime은 string이지만 숫자 형태이므로 Number로 변환
				const mealValue = Number(mealTime);

				// mealOptions에서 value와 매칭되는 항목 찾기
				const matchedOption = mealOptions.find(
					(option) => option.value === mealValue,
				);

				if (matchedOption) {
					// iconName을 가져와서 대문자로 변환
					body.mealTime = matchedOption.iconName.toUpperCase();
				} else {
					console.warn('잘못된 mealTime 값:', mealTime);
				}
			}

			if (menu) {
				const menuToLocalFoodTypeMap: Record<string, string> = {
					돔베고기: 'DOMBE_MEAT',
					고기국수: 'MEAT_NOODLE_SOUP',
					성게미역국: 'SEA_URCHIN_SEAWEED_SOUP',
					고사리해장국: 'BRACKEN_HANGOVER_SOUP',
					옥돔구이: 'GRILLED_RED_TILEFISH',
					갈치구이: 'GRILLED_CUTLASSFISH',
					회: 'RAW_FISH_MULHOE',
					빙떡: 'BING_RICE_CAKE',
					오메기떡: 'OMEGI_RICE_CAKE',
				};

				const mappedType = menuToLocalFoodTypeMap[menu]; // enum 키 값
				if (mappedType) {
					body.localFood = {
						type: mappedType, // 반드시 enum 키로
						...(searchParams.get('minPrice')
							? { minPrice: Number(searchParams.get('minPrice')) }
							: {}),
						...(searchParams.get('maxPrice')
							? { maxPrice: Number(searchParams.get('maxPrice')) }
							: {}),
					};
				} else {
					console.warn('선택한 메뉴가 enum 매핑에 없습니다:', menu);
				}
			}
			const keywords = searchParams.getAll('keywords');
			if (keywords.length > 0) {
				body.keywords = keywords;
			}

			setLoading(true);

			console.log('요청 body입니다', body);
			const res = await api.post('/v1/reviews/search', body);
			console.log('응답 데이터 :', res.data);

			if (!res.data.data) return;
			const { content, totalElements } = res.data.data;

			if (content) {
				setReviews((prev) => {
					const newReviews = content
						.map(toReview)
						.filter((r: Review) => !prev.find((pr) => pr.id === r.id));

					const updatedReviews = [...prev, ...newReviews];
					setHasMoreReviews(updatedReviews.length < totalElements); // ✅ 여기로 이동
					return updatedReviews;
				});
			}
			pageRef.current += 1;
		} finally {
			setLoading(false);
			fetchRef.current.reviews = false;
		}
	}, [
		query,
		sortOption,
		mealTime,
		menu,
		rating,

		distance,
		searchParams,
		location?.coords,
	]);

	const fetchStores = useCallback(async () => {
		if (!query || !hasMore) return;
		fetchingRef.current = true;
		setLoading(true);

		try {
			const body: StoreSearchBody = {
				query,

				sort: sortOption,
			};

			if (distance && location?.coords) {
				const lat = location?.coords.latitude;
				const lng = location?.coords.longitude;
				const radius = parseInt(distance, 10) || 1000;
				body.location = {
					latitude: Number(lat),
					longitude: Number(lng),
					radius,
				};
			}
			if (rating) {
				body.rating = { min: rating };
			}
			if (mealTime !== null) {
				// mealTime은 string이지만 숫자 형태이므로 Number로 변환
				const mealValue = Number(mealTime);

				// mealOptions에서 value와 매칭되는 항목 찾기
				const matchedOption = mealOptions.find(
					(option) => option.value === mealValue,
				);

				if (matchedOption) {
					// iconName을 가져와서 대문자로 변환
					body.mealTime = matchedOption.iconName.toUpperCase();
				} else {
					console.warn('잘못된 mealTime 값:', mealTime);
				}
			}
			if (menu) {
				const menuToLocalFoodTypeMap: Record<string, string> = {
					돔베고기: 'DOMBE_MEAT',
					고기국수: 'MEAT_NOODLE_SOUP',
					성게미역국: 'SEA_URCHIN_SEAWEED_SOUP',
					고사리해장국: 'BRACKEN_HANGOVER_SOUP',
					옥돔구이: 'GRILLED_RED_TILEFISH',
					갈치구이: 'GRILLED_CUTLASSFISH',
					회: 'RAW_FISH_MULHOE',
					빙떡: 'BING_RICE_CAKE',
					오메기떡: 'OMEGI_RICE_CAKE',
				};
				const mappedType = menuToLocalFoodTypeMap[menu]; // enum 키 값
				if (mappedType) {
					body.localFood = {
						type: mappedType, // 반드시 enum 키로
						...(searchParams.get('minPrice')
							? { minPrice: Number(searchParams.get('minPrice')) }
							: {}),
						...(searchParams.get('maxPrice')
							? { maxPrice: Number(searchParams.get('maxPrice')) }
							: {}),
					};
				} else {
					console.warn('선택한 메뉴가 enum 매핑에 없습니다:', menu);
				}
			}

			const keywords = searchParams.getAll('keywords');
			if (keywords.length > 0) {
				body.keywords = keywords;
			}
			const hasFilter = rating || menu || keywords.length > 0;

			if (!hasFilter) {
				body.page = pageRef.current;
			}
			let allPlaces: Store[] = [];
			let isEnd = false;
			let currentPage = pageRef.current;
			while (!isEnd) {
				const bodys: StoreSearchBody = {
					...body,
					page: hasFilter ? 0 : currentPage, // ✅ 필터 없으면 currentPage 반영
				};
				const endpoint = hasFilter
					? '/v1/restaurants/search/filter?page=0'
					: '/v1/restaurants/search';
				const res = await api.post<SearchResponse>(endpoint, bodys);
				console.log('응답데이터', res.data);

				const data = res.data?.data;
				if (!data) {
					break;
				}

				let places: Store[] = [];
				if ('places' in data) {
					places = data.places;
					isEnd = data.is_end;
					currentPage = data.current_page + 1;
				} else if ('data' in data && 'content' in data.data) {
					places = data.data.content;
					isEnd = data.data.last;
					currentPage = data.data.pageable.pageNumber + 1;
				}

				if (!places || places.length === 0) {
					break;
				}

				allPlaces = [...allPlaces, ...places];
			}

			const newStores: FrontendPlace[] = allPlaces.map(toStore);
			setStores((prev) => {
				console.log('파싱 후 가게 데이터:', newStores);
				const merged = [...prev, ...newStores];
				const unique = merged.filter(
					(store, idx, arr) => arr.findIndex((s) => s.id === store.id) === idx,
				);

				return unique;
			});
			console.log('isEnd', isEnd);
			if (!isEnd) {
				pageRef.current += 1;
			} else {
				setHasMore(false);
				return;
			}
			pageRef.current = currentPage + 1;
		} finally {
			setLoading(false);
		}
	}, [
		query,
		searchParams,
		distance,
		rating,
		menu,
		mealTime,
		sortOption,
		location?.coords,
		hasMore,
	]);
	useEffect(() => {
		const node = loaderRef.current;
		if (!node) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					if (tab === 'review' && !fetchRef.current.reviews) {
						fetchReviews();
					}
					if (tab === 'store' && !fetchRef.current.stores) {
						fetchStores();
					}
				}
			},
			{ threshold: 1.0 },
		);
		observer.observe(node);
		return () => {
			observer.unobserve(node);
		};
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

		setStores([]);
		setReviews([]);
		setReviewPage(1);
		setHasMore(true);
		pageRef.current = 0;
		setHasMoreReviews(true);

		fetchStores();
		fetchReviews();
	};
	useEffect(() => {
		if (tab === 'review' && reviews.length === 0) {
			fetchReviews();
		}
		if (tab === 'store' && stores.length === 0) {
			fetchStores();
		}
	}, [tab, fetchReviews, fetchStores, query, reviews.length, stores.length]);
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
		<AppShell showBottomNav={true}>
			<main className="flex flex-col h-screen cursor-pointer pb-[80px]">
				<HeaderBox
					onLocationSaved={handleLocationSaved}
					bgColorClass="bg-white"
				/>
				<div className=" bg-white flex-1 overflow-y-auto scrollbar-hide cursor-pointer">
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
									onChange={(val) => {
										setInputValue(val);
										setText(val);
									}}
									onSearchClick={() => {
										setQuery(inputValue);
										setText('');
										const params = new URLSearchParams(searchParams.toString());
										params.set('q', inputValue);
										params.delete('filter');
										router.push(`/search?${params.toString()}`);
										setFilter(null);

										pageRef.current = 1;
										setStores([]);
										setReviews([]);
										setReviewPage(1);
										setHasMore(true);
										setHasMoreReviews(true);
										if (tab === 'review') fetchReviews();
										if (tab === 'store') fetchStores();
									}}
									leftIcon={
										<Icon name="Search" size="s" className="text-grey-50" />
									}
									rightIcon={
										<Icon name="Cancel" size="xl" className="text-grey-50" />
									}
									className="min-w-[315px] max-w-[400px] w-full h-[44px] flex items-start bg-grey-10 text-[14px] text-grey-90"
									rightIconOnClick={handleReset}
								/>
							</div>
						</section>
						{/* 탭 (리뷰 / 가게명) */}
						<div className="flex mt-6 border-b border-gray-100 justify-center gap-x-40 cursor-pointer">
							<button
								className={`pb-2 text-base font-semibold cursor-pointer ${
									tab === 'store'
										? 'text-gray-900 border-b-2 border-gray-900'
										: 'text-gray-400'
								}`}
								onClick={() => setTab('store')}
							>
								가게명
							</button>
							<button
								className={`pb-2 text-base font-semibold cursor-pointer ${
									tab === 'review'
										? 'text-gray-900 border-b-2 border-gray-900'
										: 'text-gray-400'
								}`}
								onClick={() => setTab('review')}
							>
								리뷰
							</button>
						</div>
					</div>

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
								<Auto query={text} onSelect={handleSelect} />
							</div>
							{priceSummary ? (
								// PriceSummary 있을 때
								<div className="bg-grey-10 mt-4 h-[800px] pt-2 pb-6 ">
									<div className="flex justify-center px-4">
										{(() => {
											const derivedIcon = pickIconByMenu({
												menuName: priceSummary.displayName,
												localFoodType: localFoodTypeForIcon,
											});
											return (
												<PriceSummary
													MenuName={priceSummary.displayName}
													icon={derivedIcon} // 존재하는 아이콘 키로 바꾸세요
													id={1}
													avgPrice={priceSummary.averagePrice}
													minPrice={priceSummary.minPrice}
													maxPrice={priceSummary.maxPrice}
													minRate={0}
													maxRate={0}
												/>
											);
										})()}
									</div>
									<div className="mt-4 w-full flex flex-col">
										{stores.map((store, index) => (
											<StoreInfoCard
												review={store}
												key={store.id ?? `${store.name}-${index}`}
											/>
										))}
										<div ref={loaderRef} className="h-[1px] w-full opacity-0" />{' '}
										{/* sentinel */}
									</div>
									{showToast && (
										<Toast
											message="위치가 설정되었어요."
											duration={2000}
											onClose={handleToastClose}
										/>
									)}
								</div>
							) : null}
						</>
					)}
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
									onSortChange={handleSortChange}
								/>
								<Auto query={text} onSelect={handleSelect} />
							</div>

							{priceSummary ? (
								// PriceSummary 있을 때
								<div className="bg-grey-10 mt-4 h-[800px] pt-2 pb-6 ">
									<div className="flex justify-center px-4">
										{(() => {
											const derivedIcon = pickIconByMenu({
												menuName: priceSummary.displayName,
												localFoodType: localFoodTypeForIcon,
											});
											return (
												<PriceSummary
													MenuName={priceSummary.displayName}
													icon={derivedIcon} // 존재하는 아이콘 키로 바꾸세요
													id={1}
													avgPrice={priceSummary.averagePrice}
													minPrice={priceSummary.minPrice}
													maxPrice={priceSummary.maxPrice}
													minRate={0}
													maxRate={0}
												/>
											);
										})()}
									</div>
									{/* 리뷰 리스트 */}
									<div className="flex flex-wrap justify-between mt-4">
										{reviews.length === 0 ? (
											<p className="w-full text-center text-grey-60 mt-10">
												검색 결과와 비슷한 리뷰가 없어요
											</p>
										) : (
											reviews.map((review) => (
												<ReviewStoreCard key={review.id} review={review} />
											))
										)}
									</div>
								</div>
							) : (
								// PriceSummary 없을 때
								<div className="bg-white mt-4 ml-2 w-full pt-0 pb-6">
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
				</div>
			</main>
		</AppShell>
	);
}
