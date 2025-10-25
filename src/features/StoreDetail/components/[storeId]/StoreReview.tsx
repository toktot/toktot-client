'use client';

import { useEffect, useRef, useState } from 'react';

import { ReviewStatisticsServer } from '@/entities/review/api/statisticsSchema';
import { mockReviews } from '@/entities/store/model/mockReview';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import api from '@/features/home/lib/api';
import { mockHome } from '@/features/home/model/mockHome';

import { reviewStatisticsApi } from '@/shared/api/reviewStatisticsApi';
import { StoreId } from '@/shared/model/types';
import Icon from '@/shared/ui/Icon';

import ReviewCard, { ReviewCardProps } from '../ReviewCard';

export interface Tooltip {
	id: number;
	rating?: number;
	servingSize?: number;
	detailedReview?: string;
	type: 'FOOD' | 'SERVICE' | 'CLEANLINESS';
	menuName?: string;
	totalPrice?: number;
}
export interface ReviewImage {
	imageId: string;
	imageUrl: string;
	imageOrder: number;
	isMain: boolean;
	tooltips: Tooltip[];
}

interface ReviewResponse {
	id: number;
	author: {
		id: number;
		nickname: string;
		profileImageUrl?: string | null;
		reviewCount: number;
		averageRating: number;
	};
	reviewRating: number;
	images: ReviewImage[];
	mealTime: 'BREAKFAST' | 'LUNCH' | 'DINNER';
	createdAt: string;
	satisfactionScore: number;
	keywords: string[];
	isBookmarked: boolean;
	isWriter: boolean;
}

export interface ReviewCardImage {
	imageId: string;
	imageUrl: string;
	imageOrder: number;
	isMain: boolean;
	tooltips: Tooltip[];
}

export interface ReviewCard {
	id: number;
	author: {
		id: number;
		nickname: string;
		profileImageUrl?: string;
		reviewCount: number;
		averageRating: number;
	};
	reviewRating: number;
	images: ReviewCardImage[];
	mealTime: 'BREAKFAST' | 'LUNCH' | 'DINNER';
	date: string;
	gasimbi: number;
	text: Record<string, unknown>;
	type: string;
	keywords: string[];
	categories: Record<string, unknown>;
	isBookmarked: boolean;
	isWriter: boolean;
}

function mapReviewResponseToCard(review: ReviewResponse): ReviewCard {
	return {
		id: review.id,
		author: {
			id: review.author.id,
			nickname: review.author.nickname,
			profileImageUrl: review.author.profileImageUrl ?? undefined,
			reviewCount: review.author.reviewCount,
			averageRating: review.author.averageRating,
		},
		reviewRating: review.reviewRating,
		images: review.images.map((img) => ({
			imageId: img.imageId, // string 그대로 사용
			imageUrl: img.imageUrl,
			imageOrder: img.imageOrder,
			isMain: img.isMain,
			tooltips: img.tooltips.map((tt) => ({
				id: tt.id,
				type: tt.type,
				rating: tt.rating,
				menuName: tt.menuName,
				totalPrice: tt.totalPrice,
				detailedReview: tt.detailedReview,
				servingSize: tt.servingSize,
			})),
		})),
		mealTime: review.mealTime,
		date: review.createdAt,
		gasimbi: review.satisfactionScore,
		text: {},
		keywords: review.keywords,
		type: '음식',
		categories: {},
		isBookmarked: review.isBookmarked ?? false,
		isWriter: review.isWriter,
	};
}

interface Star {
	fillColor?: string;
}

export default function StoreReview({ fillColor = '#3AC8FF' }: Star) {
	// 상단 정보용: mockHome의 첫 번째 데이터 사용 (실제 서비스라면 선택한 가게 정보 사용)
	const params = useParams();
	const router = useRouter();
	const storeId = params.storeId as StoreId;

	const [reviews, setReviews] = useState<ReviewCardProps['review'][]>([]);
	const [, setLoading] = useState(false);
	const [reviewStats, setReviewStats] = useState<ReviewStatisticsServer | null>(
		null,
	);
	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) router.replace('/login');
	}, [router]);
	const [, setReviewStatsError] = useState<string | null>(null);
	const [, setIsReviewStatsLoading] = useState(true);

	useEffect(() => {
		const fetchReviewStatistics = async () => {
			try {
				setIsReviewStatsLoading(true);
				setReviewStatsError(null);
				const data = await reviewStatisticsApi.getReviewStatistics(storeId);

				setReviewStats(data);
			} catch (err) {
				console.error('리뷰 통계 불러오기 실패', err);
				setReviewStats(null);
			}
		};
		if (storeId) fetchReviewStatistics();
	}, [storeId]);

	useEffect(() => {
		const fetchReviews = async () => {
			setLoading(true);
			try {
				if (!storeId) return;

				const sort = 'RATING';

				const res = await api.get(`/v1/restaurants/${storeId}/reviews`, {
					params: { sort },
				});
				console.log('API 응답', res.data);
				const content = res.data.data.content;

				const mapped: ReviewCard[] = content.map((r: ReviewResponse) =>
					mapReviewResponseToCard(r),
				);
				setReviews(mapped);
			} catch (err) {
				console.error(err);
				setReviews([]);
			} finally {
				setLoading(false);
			}
		};
		fetchReviews();
	}, [storeId]);
	const store = mockHome.find((s) => s.id === Number(storeId));

	const TABS = [
		`전체 ${reviewStats?.totalReviewCount ?? 0}`,
		`음식 ${reviewStats?.totalReviewCount ?? 0}`,
		`서비스 ${store?.serviceNumber ?? 0}`,
		`청결 ${store?.cleanNumber ?? 0}`,
	] as const;
	// 탭 상태

	const [selectedTab, setSelectedTab] = useState<(typeof TABS)[number]>(
		`전체 ${reviewStats?.totalReviewCount ?? 0}`,
	);
	// 필터링된 리뷰
	const filteredReviews = reviews.filter((review) => {
		if (selectedTab.startsWith('전체')) return true;
		const tabTypeMap: Record<string, Tooltip['type']> = {
			음식: 'FOOD',
			서비스: 'SERVICE',
			청결: 'CLEANLINESS',
		};
		const tabKey = Object.keys(tabTypeMap).find((key) =>
			selectedTab.startsWith(key),
		);
		if (!tabKey) return true;

		const typeToCheck = tabTypeMap[tabKey];

		return review.images.some((img) =>
			img.tooltips.some((tt) => tt.type === typeToCheck),
		);
	});

	// 탭에 맞게 리뷰 필터

	const [currentReviewId, setCurrentReviewId] = useState<number | null>(null);

	const reviewRefs = useRef<Record<number, HTMLDivElement | null>>({});

	useEffect(() => {
		const container = document.querySelector('.overflow-y-auto');
		if (!container) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
				if (visible?.target) {
					const id = Number(visible.target.getAttribute('data-id'));
					setCurrentReviewId(id);
				}
			},
			{
				root: container, // 👈 스크롤 영역을 root로 지정
				threshold: 0.6,
			},
		);
		Object.values(reviewRefs.current).forEach((el) => {
			if (el) observer.observe(el);
		});

		return () => observer.disconnect();
	}, [filteredReviews]);
	const avgGasimbi = mockReviews[0]?.averagegasimbi ?? 0;

	return (
		<div className="bg-grey-10">
			<div className="min-w-[375px] max-w-[480px] overflow-y-auto flex flex-col items-center rounded-md bg-white">
				{/* 상단: 리뷰 요약 */}
				<div className="flex justify-center w-full px-11 py-4 items-center ">
					<div className="flex flex-col items-start max-w-[480px]">
						<div className="flex items-center mb-1 ml-2">
							<span className="text-grey-80 text-sm">
								{reviewStats?.totalReviewCount}
							</span>
							<span className="text-grey-70 text-[12px]">개 리뷰 평점</span>
						</div>
						<div className="flex items-center gap-4 sm:gap-10 w-full">
							<div className="flex items-center gap-5 mr-2">
								<Icon
									name={'Star'}
									fill={fillColor}
									className="outline-none stroke-0 "
									color={fillColor}
									size="xxl"
								/>
								<span className="text-3xl text-primary font-bold">
									{reviewStats?.overallRating.toFixed(1)}
								</span>
							</div>

							<div className="flex flex-col text-xs text-gray-500 gap-2 -mt-5">
								{[
									{
										label: '음식',
										value: reviewStats?.tooltipRatings.foodRating ?? 0,
										color: 'bg-blue-400',
									},
									{
										label: '청결',
										value: reviewStats?.tooltipRatings.cleanRating ?? 0,
										color: 'bg-green-400',
									},

									{
										label: '서비스',
										value: reviewStats?.tooltipRatings.serviceRating ?? 0,
										color: 'bg-orange-400',
									},
								].map(({ label, value, color }) => (
									<div key={label} className="flex items-center w-full">
										<span className="ml-2 w-[35px]">{label}</span>
										<Bar value={value} color={color} />
										<span className="ml-2 font-semibold">
											{value.toFixed(1)}
										</span>
										<span>점</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
				<div className="h-[8px] bg-grey-10 w-full mb-5" />
				<div className="w-full px-10">
					<span className="text-base font-semibold block text-left mb-3">
						가격에 비해 만족스럽나요?
					</span>
				</div>

				<div className="flex justify-between items-center mb-6 gap-3 sm:gap-10">
					<div className="flex flex-col items-center justify-center w-20 h-20 rounded-xl bg-gray-100">
						<span className="text-xs text-gray-500">평균 가심비</span>
						<span className="text-2xl font-bold text-primary-40">
							{avgGasimbi}점
						</span>
					</div>
					<div className="flex flex-col text-xs text-grey-85 gap-2 flex-1 ml-4">
						{[
							{
								label: '만족해요',
								value: reviewStats?.satisfactionDistribution.highRange,
								range: '100~70',
							},
							{
								label: '보통이에요',
								value: reviewStats?.satisfactionDistribution.midRange,
								range: '69~40',
							},
							{
								label: '아쉬워요',
								value: reviewStats?.satisfactionDistribution.lowRange,
								range: '39~0',
							},
						]
							.sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
    .map(({ label, value, range }, _, arr) => {
      const pct = Number(value ?? 0);
      const maxValue = Math.max(...arr.map((item) => Number(item.value ?? 0)));
      const isMax = pct === maxValue;

      return (
        <div key={label} className="flex items-center w-full">
          <span className="ml-2 w-[55px] text-[12px] text-grey-85">{label}</span>
          <span className="text-[9px] text-grey-50 w-[40px]">{range}</span>

          <div className="relative sm:w-[90px] w-[70px] h-[6px] bg-gray-200 overflow-hidden ml-2">
            <div
              className={`absolute h-[6px] ${isMax ? 'bg-grey-90' : 'bg-grey-50'}`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>

          <span className={`ml-2 font-semibold ${isMax ? 'text-grey-90' : 'text-grey-50'}`}>
            {pct.toFixed(2)}%
          </span>
        </div>
      );
    })}
</div>
				</div>
			</div>

			{/* 탭 영역 */}

			<div className="flex items-center gap-2 w-full px-4 mb-4 mt-2 rounded-md h-[53px] bg-white overflow-x-auto scrollbar-hide cursor-pointer">
				{TABS.map((tab) => {
					const [label, count] = tab.split(' ');
					const isSelected = selectedTab === tab;
					return (
						<button
							key={tab}
							className={`px-4 py-2 rounded-full text-sm cursor-pointer ${
								isSelected ? 'bg-grey-90 text-white' : 'bg-grey-10 text-grey-70'
							}`}
							onClick={() => setSelectedTab(tab)}
						>
							<span className="font-medium">{label}</span>
							<span
								className={`ml-1 ${isSelected ? 'text-primary-40' : 'text-grey-60'} font-semibold`}
							>
								{count}
							</span>
						</button>
					);
				})}
			</div>

			{/* 리뷰 카드 리스트 */}
			<div className=" w-full">
				{filteredReviews.length > 0 ? (
					filteredReviews.map((review) => (
						<ReviewCard
							key={review.id}
							review={review}
							isCurrent={review.id === currentReviewId}
							ref={(el) => {
								reviewRefs.current[review.id] = el;
							}}
						/>
					))
				) : (
					<div className="text-center text-gray-500 text-sm">
						해당 카테고리에 대한 리뷰가 없습니다.
					</div>
				)}
			</div>
		</div>
	);
}

/**
 * 평점 그래프 막대 UI 컴포넌트
 */
function Bar({ value, color }: { value: number; color: string }) {
	return (
		<div className="relative w-[80px] sm:w-[100px] ml-2 h-2 bg-gray-200 rounded-full overflow-hidden">
			<div
				className={`absolute h-2 rounded-full ${color}`}
				style={{ width: `${Math.min((value / 5) * 100, 100)}%` }}
			/>
		</div>
	);
}
