'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { detailCategories } from '@/entities/cataegory/detailCategories';
import { mockStores } from '@/entities/store/model/mockStore';
import { useRouter, useSearchParams } from 'next/navigation';

import HeaderBox from '@/shared/components/HeaderBox';
import NearCard from '@/shared/components/NearCard';
import SearchBox from '@/shared/components/SearchBox';
import Toast from '@/shared/components/Toast';
import { useCurrentLocation } from '@/shared/location/lib/useCurrentLocation';
import Icon from '@/shared/ui/Icon';
import { getDecryptedToken } from '@/shared/utils/storage';

import api from '../lib/api';
import FilterBar from './FilterBar';
import CategoryGrid from './FoodIcon';
import PhotoReviewCard from './ReviewCardNew';
import AlarmBox from './alarmBox';
import PriceTabs from './homeStore';

interface NearbyStore {
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
}

interface Author {
	id: number;
	nickname: string;
	profileImageUrl: string | null;
	reviewCount: number;
	averageRating: number;
}

interface Restaurant {
	id: number;
	name: string;
	representativeMenu: string | null;
	address: string;
	distanceInKm: string | null;
}
export interface PopularReview {
	id: number;
	author: Author;
	isBookmarked: boolean;
	valueForMoneyScore: number;
	keywords: string[];
	imageUrl: string;
	restaurant: Restaurant;
	rating: number | null;
}

interface GoodPriceStore {
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
}
const formatDistance = (d: number | null): string => {
	if (d == null || Number.isNaN(d)) return '';
	// Heuristic: if it's over 1000 it's probably meters; format to km
	if (d >= 1000) return `${(d / 1000).toFixed(1)}km`;
	// if it's less than 10 but not a tiny number, might already be km
	if (d > 0 && d < 10) return `${d.toFixed(1)}km`;
	return `${Math.round(d)}m`;
};

const extractMenus = (menus: string | null | undefined): string[] => {
	if (!menus) return [];
	return menus
		.split(',')
		.map((m) => m.trim())
		.filter(Boolean);
};

export default function HomeContainer() {
	const searchParams = useSearchParams();

	const [filter, setFilter] = useState<number | null>(null);
	const [query, setQuery] = useState('');

	const router = useRouter();
	const [showToast, setShowToast] = useState(false);
	const [, setGoodPriceStores] = useState<GoodPriceStore[]>([]);
	const [nearbyStores, setNearbyStores] = useState<NearbyStore[]>([]);
	const {
		location,
		loading: locationLoading,
		error: locationError,
	} = useCurrentLocation();
	const [price, setPrice] = useState<number>(0);
	const [food, setFood] = useState(searchParams.get('food') || '');
	const [popularReviews, setPopularReviews] = useState<PopularReview[]>([]);

	useEffect(() => {
		if (!location || locationError) {
			setNearbyStores([]);
			return;
		}

		const fetchNearbyStores = async () => {
			try {
				const response = await api.post(
					'/v1/restaurants/search/filter?page=0',
					{
						location: {
							latitude: location.coords.latitude,
							longitude: location.coords.longitude,
							radius: 1000, // 1km 반경
						},
					},
				);

				let stores: NearbyStore[] = response?.data?.data?.content ?? [];

				stores = stores.slice(0, 5);
				setNearbyStores(stores);
			} catch (error) {
				console.error('가까운 식당 조회 실패', error);
			}
		};

		fetchNearbyStores();
	}, [location, locationError]);

	console.log(setPrice, setFood);
	const fetchGoodPriceStores = useCallback(
		async (priceValue?: number, foodName?: string) => {
			try {
				const actualPrice = priceValue || price || 0;

				const response = await api.get('/v1/restaurants/good-price', {
					params: {
						priceRange: actualPrice,
						latitude: 33.4996,
						longitude: 126.5312,
						page: 0,
						size: 10,
					},
				});
				let stores: GoodPriceStore[] = response?.data?.data?.content ?? [];

				if (foodName) {
					stores = stores.filter((store) => {
						const menus = extractMenus(store.main_menus);
						const matchesFood = menus.some((m) => m.includes(foodName));

						const matchesPrice = menus.some((menu) => {
							const match = menu.match(/(\d+)[,]?(\d*)\s*원|₩\s*(\d+)/);
							const num = match
								? parseInt(match[1] || match[3] || '0', 10) * (match[2] ? 1 : 1)
								: NaN;
							if (!num) return false;
							const selected = actualPrice;
							if (selected === 0 || null) return num < 10000;
							if (selected === 10000) return num >= 10000 && num < 20000;
							if (selected === 20000) return num >= 20000 && num < 30000;
							if (selected === 30000) return num >= 30000 && num < 50000;
							if (selected === 50000) return num >= 50000 && num < 70000;
							if (selected === 70000) return num >= 70000;
							return true; // if price filter is 0 or invalid
						});

						return matchesFood && matchesPrice;
					});
				}
				const normalized: GoodPriceStore[] = stores.slice(0, 3).map((s) => ({
					id: s.id,
					name: s.name,
					distance: formatDistance(Number(s.distance ?? 0)),
					main_menus: s.main_menus ?? '',
					average_rating: s.average_rating ?? 0,
					address: s.address ?? '',
					review_count: s.review_count ?? 0,
					is_good_price_store: !!s.is_good_price_store,
					is_local_store: !!s.is_local_store,
					image: s.image ?? '',
				}));
				setGoodPriceStores(normalized);
			} catch (error) {
				console.error('가격 착한 가게 조회 실패', error);
			}
		},
		[price],
	);

	// 위치 없으면 해당 영역 렌더링 X

	useEffect(() => {
		fetchGoodPriceStores(price, food);
	}, [price, food, fetchGoodPriceStores]);
	const handleMoreClick = () => {
		const params = new URLSearchParams();
		const price = searchParams.get('price');
		const food = searchParams.get('food');
		if (price) params.set('price', price);
		if (food) params.set('food', food);
		router.push(`/goodstore?${params.toString()}`);
	};

	const handleSearchClick = () => {
		console.log('검색어', query);
	};

	const handleFilterChange = (newFilter: number | null) => {
		setFilter(newFilter);
		const params = new URLSearchParams(searchParams.toString());
		if (newFilter !== null) {
			params.set('filter', newFilter.toString());
		} else {
			params.delete('filter');
		}
		const fromParam = searchParams.get('from') ?? '';
		params.set('from', fromParam);
		router.push(`/search?from=&q=${query}&${params.toString()}`);
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

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) router.replace('/login');
	}, [router]);

	useEffect(() => {
		const fetchPopularReviews = async () => {
			try {
				const response = await api.get('/v1/home/popular-reviews');
				const data: PopularReview[] = response?.data?.data ?? [];
				setPopularReviews(data);
			} catch (error) {
				console.error('인기 리뷰 조회 실패', error);
			}
		};
		fetchPopularReviews();
	}, []);
	const filteredReviews = useMemo(() => {
		return popularReviews.filter((r) => {
			if (
				query &&
				!r.restaurant.name.toLowerCase().includes(query.toLowerCase())
			)
				return false;

			const distance = searchParams.get('distance');
			if (
				distance &&
				r.restaurant.distanceInKm &&
				parseFloat(r.restaurant.distanceInKm) > Number(distance)
			)
				return false;

			// 별점 필터
			const rating = Number(searchParams.get('rating') ?? 0);
			if (rating && r.rating && r.rating < rating) return false;

			// 식사 시간 필터
			/*
			const mealTime = searchParams.get('meal');
			if (mealTime && r.mealTime !== mealTime) return false;
*/
			// 메뉴 필터
			const menu = searchParams.get('menu');
			if (menu && r.restaurant.representativeMenu) {
				const firstMenu = JSON.parse(r.restaurant.representativeMenu).firstMenu;
				if (firstMenu !== menu) return false;
			}

			// 기타 상세 필터
			for (const cat of detailCategories) {
				const raw = searchParams.get(cat.id);
				if (!raw) continue;

				const selectedIds = raw.split('.').map(Number);
				const selectedLabels = cat.options
					.filter((opt) => selectedIds.includes(opt.id))
					.map((opt) => opt.label);

				if (!selectedLabels.every((label) => r.keywords.includes(label))) {
					return false;
				}
			}
			return true;
		});
	}, [query, searchParams, popularReviews]);

	return (
		<main className="flex flex-col h-screen">
			<HeaderBox onLocationSaved={handleLocationSaved} />
			<div className="flex-1 overflow-y-auto scrollbar-hide pb-[80px] h-auto">
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
							똑똣에서 가장 많이 저장된 후기 PICK!
						</h2>
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
							{filteredReviews.map((review) => (
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
					</div>
					<PriceTabs
						initialPrice={price}
						initialFood={food}
						onChange={(priceValue, foodName) => {
							setPrice(priceValue);
							setFood(foodName);
							fetchGoodPriceStores(priceValue, foodName);
						}}
					/>

					<div className="flex justify-center mt-5">
						<button
							className="min-w-[343px] max-w-[430px] w-full border border-grey-40 rounded-3xl text-grey-90 text-center py-2"
							onClick={handleMoreClick}
						>
							더보기
						</button>
					</div>

					{/* PhotoReviewCard 목록 */}
					{!locationLoading &&
						location &&
						!locationError &&
						nearbyStores.length > 0 && (
							<section className="mt-8 flex flex-col">
								{/* 가격도 착하고 맛까지 좋은 가게 */}
								<div className="mt-8 flex items-center justify-between mb-4">
									<h2 className="text-[18px] font-semibold">
										지금 만나보는 가까운 식당
									</h2>
									<button
										className="text-sm text-gray-500"
										onClick={() => {
											router.push(`/search?tab=store`);
										}}
									>
										더보기
									</button>
								</div>

								<div className="flex flex-col gap-4">
									{nearbyStores.map((store) => (
										<NearCard key={store.id} review={store} />
									))}
								</div>
							</section>
						)}
					{/* StoreInfoCard 목록 */}
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
