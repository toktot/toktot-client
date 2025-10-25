'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { detailCategories } from '@/entities/cataegory/detailCategories';
import { mockStores } from '@/entities/store/model/mockStore';
import { useRouter, useSearchParams } from 'next/navigation';

import { useLocation } from '@/features/locationsetting/components/LocationContext';

import HeaderBox from '@/shared/components/HeaderBox';
import NearCard from '@/shared/components/NearCard';

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
import HomeSearchBox from '@/shared/components/HomeSearchBox';
import { fetchGoodPriceStores } from '../lib/fetchGoodPrice';

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

interface Restaurants {
	id: number;
	name: string;
	representativeMenu: string | null;
	address: string;
	distanceInKm: number | null;
}

interface ContentItem {
	id: number;
	mainImageUrl: string;
	authorProfileImageUrl: string | null;
	authorNickname: string;
	createdAt: string;
	restaurant: Restaurants;
	isBookmarked: boolean;
	isWriter: boolean;
}

interface ApiResponse {
	success: boolean;
	data: {
		content: ContentItem[];
	};
}

interface Restaurant {
	id: number;
	name: string;
	representativeMenu: string | null;
	address: string;
	distanceInKm: string | null;
}
interface Author {
	id: number;
	nickname: string;
	profileImageUrl: string | null;
	reviewCount: number;
	averageRating: number;
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



export default function HomeContainer() {
	const searchParams = useSearchParams();

	const [filter, setFilter] = useState<number | null>(null);
	const [query, setQuery] = useState('');
	const [user, setUser] = useState<string | null>(null);
	const router = useRouter();
	const [showToast, setShowToast] = useState(false);
	const [, setGoodPriceStores] = useState<GoodPriceStore[]>([]);
	const [nearbyStores, setNearbyStores] = useState<NearbyStore[]>([]);
	const { location: selectedLocation } = useLocation();

	const {
		location: currentLocation,
		loading: locationLoading,
		error: locationError,
	} = useCurrentLocation();
	const effectiveLocation = selectedLocation;
	const [price, setPrice] = useState<number>(0);
	const [food, setFood] = useState(searchParams.get('food') || '');
	const [popularReviews, setPopularReviews] = useState<PopularReview[]>([]);
	const [openLocationSheet, setOpenLocationSheet] = useState(false);
	useEffect(() => {
		const baseLat = selectedLocation?.lat ?? currentLocation?.coords?.latitude;
		const baseLng = selectedLocation?.lng ?? currentLocation?.coords?.longitude;
		console.log('검색 기준 위치:', { baseLat, baseLng, selectedLocation });
		if (!baseLat || !baseLng) {
			setNearbyStores([]);
			return;
		}

		const fetchNearbyStores = async () => {
			try {
				const response = await api.post(
					'/v1/restaurants/search/filter?page=0',
					{
						location: {
							latitude: baseLat,
							longitude: baseLng,
							radius: 1000, // 1km 반경
						},
					},
				);
				if (!response.data) {
					return;
				}

				let stores: NearbyStore[] = response?.data?.data?.data?.content ?? [];

				stores = stores.slice(0, 5);
				setNearbyStores(stores);
			} catch (error) {
				console.error('가까운 식당 조회 실패', error);
			}
		};

		fetchNearbyStores();
	}, [locationError, selectedLocation, currentLocation]);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await api.get<ApiResponse>('/v1/reviews/my');
				const content = response?.data?.data?.content;
				if (Array.isArray(content) && content.length > 0) {
					const profile =
					response.data.data.content[0]?.authorProfileImageUrl ?? null;
				setUser(profile);
				} else {
					console.warn('콘텐츠가 비어있거나 존재하지 않음')
					setUser(null)
				}
				
			} catch (err) {
				console.error('유저 정보 불러오기 실패', err);
			}
		};
		fetchUser();
	}, []);
	const fetchGoodPriceStoresHome = useCallback(
  async (priceValue?: number, foodName?: string) => {
    try {
      const actualPrice = priceValue ?? price ?? 0;

      const { items, pageMeta } = await fetchGoodPriceStores({
        priceRange: actualPrice,
        latitude: 33.4996,
        longitude: 126.5312,
        page: 0,
        size: 20, // 페이지 크기 (원하면 50도 가능)
      });

      console.log('[home] good-price totalElements:', pageMeta?.totalElements);

      let stores = items;

      if (foodName) {
        stores = stores.filter((store) => {
          const matchesFood = store.main_menus
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
            .some((m) => m.includes(foodName));

          const match = store.main_menus.match(/(\d+)[,]?(\d*)\s*원|₩\s*(\d+)/);
          const num = match
            ? parseInt(match[1] || match[3] || '0', 10)
            : NaN;

          const selected = actualPrice;
          const inPrice =
            selected == null || selected === 0
              ? Number.isFinite(num) && num < 10000
              : selected === 10000
              ? Number.isFinite(num) && num >= 10000 && num < 20000
              : selected === 20000
              ? Number.isFinite(num) && num >= 20000 && num < 30000
              : selected === 30000
              ? Number.isFinite(num) && num >= 30000 && num < 50000
              : selected === 50000
              ? Number.isFinite(num) && num >= 50000 && num < 70000
              : selected === 70000
              ? Number.isFinite(num) && num >= 70000
              : true;

          return matchesFood && inPrice;
        });
      }

      // ✅ 홈에서는 3개만 보여주기
      const top3 = stores.slice(0, 3);
      setGoodPriceStores(top3);
      console.log('[home] show count:', top3.length);
    } catch (error) {
      console.error('가격 착한 가게 조회 실패', error);
    }
  },
  [price],
);

// 호출부 유지
useEffect(() => {
  fetchGoodPriceStoresHome(price, food);
}, [price, food, fetchGoodPriceStoresHome]);
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
		<main className="flex flex-col h-screen cursor-pointer">
			<HeaderBox
				onLocationSaved={handleLocationSaved}
				user={user}
				bgColorClass="bg-grey-10"
				open={openLocationSheet}
				setOpen={setOpenLocationSheet}
			/>
			<div className="flex-1 overflow-y-auto scrollbar-hide pb-[80px] h-auto">
				<div className="bg-grey-10">
					<section className="relative justify-center flex items-center gap-2 bg-grey-10">
						<div className="rounded-full bg-gradient-to-r from-[rgb(64,215,245)] to-[#99E5F3] p-[2px]">
							<div className="w-full min-w-[351px] sm:w-[440px]  h-[48px] rounded-full bg-primary-10 flex items-center">
								<HomeSearchBox
									query={query}
									onChange={setQuery}
									onClick={() => router.push('/searchBar')}
									onSearchClick={handleSearchClick}
									leftIcon={
										<Icon name="Search" size="s" className="text-primary-40" />
									}
									className=" h-[48px] flex items-center text-primary-60 text-[14px] w-[300px]"
									
								/>
							</div>
						</div>
					</section>
					<AlarmBox />
					<div className="mt-3 mx-4 rounded-3xl p-4 bg-gradient-to-r from-[#99E5F3] via-[#99E5F3] to-[#DBF5FB] relative overflow-hidden">
						<p className="text-[16px] font-semibold text-grey-90">
							여러분만의 특별한 <br />
							제주도 음식을 작성해주세요!
						</p>
						<button
							className="mt-3 px-3 py-1 rounded-full bg-primary-40 text-primary-10 text-[12px] font-semibold cursor-pointer"
							onClick={() => {
								router.push('/review/write');
							}}
						>
							바로 작성하러가기
						</button>

						{/* 아이콘들 */}
						<div className="absolute top-3 right-24 transform -rotate-[22.39deg]">
							<Icon name="DombeGogi" className="w-10 h-10" />
						</div>
						<div className="absolute top-5 right-4 transform rotate-[10.81deg]">
							<Icon name="Googigukso" className="w-10 h-10" />
						</div>
						<div className="absolute bottom-3 right-14 transform rotate-[10.81deg]">
							<Icon name="Bingtteok" className="w-10 h-10" />
						</div>
					</div>
					<section className="mt-3 px-4 pb-4 cursor-pointer">
						<CategoryGrid />
					</section>
				</div>
				<section className="  bg-white px-4 py-4">
					{/* 상단 제목 + 더보기 */}
					<div className="flex items-center justify-between ">
						<h2 className="text-grey-90 font-semibold text-[18px]">
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
							가격도 착하고, 맛까지 좋은 가게는?
						</h2>
					</div>
					<PriceTabs
  initialPrice={price}
  initialFood={food}
  onChange={(priceValue, foodName) => {
    setPrice(priceValue);
    setFood(foodName);
    // 필요 시 다른 작업
  }}
  limit={3}         // 홈: 3개만
  pageSize={20}
/>

					<div className="flex justify-center mt-5">
						<button
							className="min-w-[343px] max-w-[430px] w-full border border-grey-20 rounded-2xl text-grey-90 text-center py-2"
							onClick={handleMoreClick}
						>
							<span className="text-[14px] font-semibold text-grey-90 mr-1">
								착한 가게
							</span>
							<span className="text-grey-70 text-[14px] font-semibold">
								더 보기
							</span>
						</button>
					</div>

					{/* PhotoReviewCard 목록 */}
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
					{!locationLoading && effectiveLocation && !locationError ? (
						nearbyStores.length > 0 ? (
							<section className="mt-8 flex flex-col">
								{/* 가격도 착하고 맛까지 좋은 가게 */}
								<div className="flex flex-col gap-4">
									{nearbyStores.map((store) => (
										<NearCard key={store.id} review={store} />
									))}
								</div>
							</section>
						) : (
							// 위치는 있지만 가게가 없을 때
							<div className="mt-8 flex flex-col items-center justify-center bg-grey-10 rounded-xl py-10">
								<p className="text-grey-60 mb-2 text-[14px]">
									현재 위치가 설정되지 않았어요
								</p>
								<button
									onClick={() => setOpenLocationSheet(true)} // 위치 설정 함수 연결
									className="px-4 py-2 border border-primary-40 text-[#00B2E8] rounded-full text-[12px] font-semibold cursor-pointer"
								>
									지금 설정하기
								</button>
							</div>
						)
					) : null}
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
