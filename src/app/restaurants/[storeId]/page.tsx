'use client';

import { useEffect, useRef, useState } from 'react';

import { mockReviews } from '@/entities/store/model/mockReview';
import { useParams } from 'next/navigation';

import ReviewCard, {
	ReviewCardProps,
} from '@/features/StoreDetail/components/ReviewCard';
import api from '@/features/home/lib/api';

import Icon from '@/shared/ui/Icon';

interface ReviewResponse {
	id: number;
	user: {
		id: number;
		nickname: string;
		profileImageUrl?: string | null;
		reviewCount: number;
		averageRating: number;
	};
	images: {
		imageId: string;
		imageUrl: string;
		imageOrder: number;
		isMain: boolean;
		tooltips: {
			id: number;
			type: 'FOOD' | 'SERVICE' | 'CLEAN';
			rating: number;
			menuName?: string | null;
			totalPrice?: number | null;
			servingSize?: number | null;
			detailedReview: string;
		}[];
	}[];
	mealTime: string;
	createdAt: string;
	satisfactionScore: number;
	keywords: string[];
	isBookmarked: boolean;
	isWriter: boolean;
}

interface ReviewStatistics {
	totalReviewCount: number;
	overallRating: number;
	tooltipRatings: {
		foodRating: number;
		cleanRating: number;
		serviceRating: number;
	};
	satisfactionDistribution: {
		highRange: number;
		midRange: number;
		lowRange: number;
	};
}

function mapReviewResponseToCard(review: ReviewResponse) {
	const text: ReviewCardProps['review']['text'] = {};
	review.images.forEach((img) => {
		img.tooltips.forEach((tt) => {
			const key = tt.type.toLowerCase() as 'food' | 'service' | 'clean';
			text[key] = [tt.id, tt.rating, tt.detailedReview];
		});
	});

	return {
		id: review.id,
		auth: {
			id: review.user.id,
			nickname: review.user.nickname,
			profileImageUrl: review.user.profileImageUrl ?? undefined,
			reviewCount: review.user.reviewCount,
			averageRating: review.user.averageRating,
		},
		rating: review.images[0]?.tooltips[0]?.rating ?? 0,
		images: review.images.map((img) => ({
			id: parseInt(img.imageId.slice(0, 8), 16), // 이미지 ID 숫자화
			imageUrl: img.imageUrl,
			menus: img.tooltips
				.filter((tt) => tt.type === 'FOOD')
				.map((tt) => ({
					menuName: tt.menuName ?? '',
					totalPrice: tt.totalPrice ?? 0,
				})),
		})),
		mealTime: review.mealTime,
		date: review.createdAt,
		gasimbi: review.satisfactionScore,
		text,
		type: '음식 23',
		categories: {},
	};
}

interface Star {
	fillColor?: string;
}

export default function StoreReview({ fillColor = '#3AC8FF' }: Star) {
	// 상단 정보용: mockHome의 첫 번째 데이터 사용 (실제 서비스라면 선택한 가게 정보 사용)
	const params = useParams();
	const storeId = Number(params.storeId);

	const [reviews, setReviews] = useState<ReviewCardProps['review'][]>([]);
	const [loading, setLoading] = useState(false);
	console.log(loading);
	const [stats, setStats] = useState<ReviewStatistics>({
		totalReviewCount: 0,
		overallRating: 0,
		tooltipRatings: { foodRating: 0, cleanRating: 0, serviceRating: 0 },
		satisfactionDistribution: { highRange: 0, midRange: 0, lowRange: 0 },
	});

	useEffect(() => {
		async function fetchReviewsAndStats() {
			setLoading(true);
			try {
				const resReviews = await api.get(`/v1/restaurants/${storeId}/reviews`, {
					params: { sort: 'RATING' },
				});
				if (resReviews?.data?.data?.content) {
					const mapped = resReviews.data.data.content.map(
						mapReviewResponseToCard,
					);
					setReviews(mapped);
				} else {
					setReviews([]);
				}
				const resStats = await api.get(
					`/v1/restaurants/${storeId}/review-statistics`,
				);
				console.log('resStats.data', resStats.data); // 서버가 실제 보내는 데이터 확인
				console.log('resStats.data.data', resStats.data.data); // 우리가 사용할 데이터
				if (resStats?.data?.success) {
					setStats(resStats.data.data);
				}
			} catch (err) {
				console.error(err);
				setReviews([]);
				setStats({
					totalReviewCount: 0,
					overallRating: 0,
					tooltipRatings: { foodRating: 0, cleanRating: 0, serviceRating: 0 },
					satisfactionDistribution: { highRange: 0, midRange: 0, lowRange: 0 },
				});
			} finally {
				setLoading(false);
			}
		}
		fetchReviewsAndStats();
	}, [storeId]);

	const TABS = [
		`전체 ${stats.totalReviewCount}`,
		`음식 ${stats.tooltipRatings.foodRating}`,
		`서비스 ${stats.tooltipRatings.serviceRating}`,
		`청결 ${stats.tooltipRatings.cleanRating}`,
	] as const;
	// 탭 상태

	const [selectedTab, setSelectedTab] = useState<(typeof TABS)[number]>(
		TABS[0],
	);

	// 탭에 맞게 리뷰 필터

	const [currentReviewId, setCurrentReviewId] = useState<number | null>(null);
	console.log(currentReviewId);
	const reviewRefs = useRef<Record<number, HTMLDivElement | null>>({});

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries.find((entry) => entry.isIntersecting);
				if (visible?.target) {
					const id = Number(visible.target.getAttribute('data-id'));
					setCurrentReviewId(id);
				}
			},
			{ threshold: 0.6 },
		);
		Object.values(reviewRefs.current).forEach((el) => {
			if (el) observer.observe(el);
		});
		return () => observer.disconnect();
	}, [reviews]);
	const avgGasimbi = mockReviews[0]?.averagegasimbi ?? 0;

	return (
		<div className="bg-grey-10">
			<div className="w-[375px] sm:w-[480px] max-w-full overflow-y-auto flex flex-col items-center rounded-md bg-white">
				{/* 상단: 리뷰 요약 */}
				<div className="flex justify-center w-full px-11 py-4 items-center ">
					<div className="flex flex-col items-start">
						<div className="flex items-center mb-1 ml-2">
							<span className="text-grey-80 text-sm">
								{stats.totalReviewCount}
							</span>
							<span className="text-grey-70 text-[12px]">개 리뷰 평점</span>
						</div>
						<div className="flex items-center gap-6">
							<div className="flex items-center gap-2 mr-2">
								<Icon
									name={'Star'}
									fill={fillColor}
									className="outline-none stroke-0 "
									color={fillColor}
									size="xxl"
								/>
								<span className="text-3xl text-primary font-bold">
									{stats.overallRating.toFixed(1)}
								</span>
							</div>

							<div className="flex flex-col text-xs text-gray-500 gap-2 -mt-5">
								{[
									{
										label: '청결',
										value: stats.tooltipRatings.cleanRating ?? 0,
										color: 'bg-green-400',
									},
									{
										label: '음식',
										value: stats.tooltipRatings.foodRating ?? 0,
										color: 'bg-blue-400',
									},
									{
										label: '서비스',
										value: stats.tooltipRatings.serviceRating ?? 0,
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
				<div className="w-full px-4">
					<span className="text-base font-semibold block text-left mb-3">
						가격에 비해 만족스럽나요?
					</span>
				</div>

				<div className="flex justify-between items-center mb-6">
					<div className="flex flex-col items-center justify-center w-20 h-20 rounded-xl bg-gray-100">
						<span className="text-xs text-gray-500">평균 가심비</span>
						<span className="text-2xl font-bold text-primary">
							{avgGasimbi}점
						</span>
					</div>
					<div className="flex flex-col text-xs text-grey-85 gap-2 flex-1 ml-4">
						{[
							{
								label: '만족해요',
								value: stats.satisfactionDistribution.highRange,
								range: '100~70',
							},
							{
								label: '보통이에요',
								value: stats.satisfactionDistribution.midRange,
								range: '69~40',
							},
							{
								label: '아쉬워요',
								value: stats.satisfactionDistribution.lowRange,
								range: '39~0',
							},
						]
							.sort((a, b) => b.value - a.value)
							.map(({ label, value, range }, _, arr) => {
								const maxValue = Math.max(...arr.map((item) => item.value));
								const isMax = value === maxValue;
								return (
									<div key={label} className="flex items-center w-full">
										<span className="ml-2 w-[55px] text-[12px] text-grey-85">
											{label}
										</span>
										<span className="text-[9px] text-grey-50 w-[40px]">
											{range}
										</span>

										<div className="relative w-[70px] h-[6px] bg-gray-200 rounded-full overflow-hidden ml-2">
											<div
												className={`absolute h-[6px] rounded-full ${
													isMax ? 'bg-grey-90' : 'bg-grey-50'
												}`}
												style={{ width: `${Math.min(value, 100)}%` }}
											/>
										</div>

										<span
											className={`ml-2 font-semibold ${isMax ? 'text-grey-90' : 'text-grey-50'}`}
										>
											{value}%
										</span>
									</div>
								);
							})}
					</div>
				</div>
			</div>

			{/* 탭 영역 */}

			<div className="flex gap-2 w-full px-4 mb-4 rounded-md h-full bg-white overflow-x-auto scrollbar-hide">
				{TABS.map((tab) => {
					const [label, count] = tab.split(' ');
					const isSelected = selectedTab === tab;
					return (
						<button
							key={tab}
							className={`px-4 py-2 rounded-full text-sm ${
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
			<div className="bg-white rounded-2xl w-full max-w-[375px] p-4 space-y-4 -mt-4">
				{reviews.length > 0 ? (
					reviews.map((review) => (
						<ReviewCard key={review.id} review={review} />
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
		<div className="relative w-[80px] h-2 bg-gray-200 rounded-full overflow-hidden">
			<div
				className={`absolute h-2 rounded-full ${color}`}
				style={{ width: `${Math.min((value / 5) * 100, 100)}%` }}
			/>
		</div>
	);
}
