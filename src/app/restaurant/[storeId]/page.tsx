'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import ReviewCard from '@/features/StoreDetail/components/ReviewCard';
import { mockHome } from '@/features/home/model/mockHome';

import Icon from '@/shared/ui/Icon';
import { getDecryptedToken } from '@/shared/utils/storage';

interface ReviewUser {
	id: number;
	nickname: string;
	profileImage?: string | null;
	reviewCount: number;
	averageRating: number;
}
interface ReviewImage {
	id: number;
	imageUrl: string;
}
interface Review {
	id: number;
	user: ReviewUser;
	images: ReviewImage[];
	keywords: string[];
	createdAt: string;
	isWriter: boolean;
}
export default function StoreReview({ fillColor = '#3AC8FF' }) {
	// 상단 정보용: mockHome의 첫 번째 데이터 사용 (실제 서비스라면 선택한 가게 정보 사용)
	const params = useParams();
	const storeId = Number(params.storeId);

	const [reviews, setReviews] = useState<Review[]>([]);
	const [loading, setLoading] = useState(true);

	const [page, setPage] = useState(0);

	const [size] = useState(5);
	const [hasMore, setHasMore] = useState(true);
	console.log(loading, setPage, hasMore);

	useEffect(() => {
		async function fetchReviews() {
			try {
				setLoading(true);
				const token = getDecryptedToken();
				const res = await fetch(
					`https://api.toktot.site/v1/restaurants/${storeId}/reviews?page=${page}&size=${size}&sort=createdAt,desc`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							'Content-Type': 'applicatin/json',
						},
					},
				);

				if (!res.ok) {
					throw new Error('리뷰 데이터를 불러오는 데 실패했습니다.');
				}
				const json = await res.json();
				console.log(json);
				const newReviews: Review[] = json.data.content;

				setReviews((prev) => [...prev, ...newReviews]);
				setHasMore(!json.data.last);
			} catch (err) {
				console.log(err);
			} finally {
				setLoading(false);
			}
		}

		if (storeId) {
			fetchReviews();
		}
	}, [storeId, page, size]);

	const store = mockHome.find((s) => s.id === storeId);
	const TABS = [
		`음식`,
		`서비스 ${store?.serviceNumber}`,
		`청결 ${store?.cleanNumber}`,
	] as const;
	// 탭 상태
	const [selectedTab, setSelectedTab] = useState<(typeof TABS)[number]>(`음식`);
	const [st] = selectedTab.split(' ');

	const filteredReviews = reviews
		.map((review) => {
			return {
				id: review.id,
				auth: {
					nickname: review.user.nickname,
					profileImage: review.user.profileImage ?? undefined,
					reviewCount: review.user.reviewCount,
					averageRating: review.user.averageRating,
				},
				rating: '4.5',
				image:
					review.images.length > 0
						? review.images[0].imageUrl
						: '/images/default.jpg',

				date: review.createdAt,
				mealTime: '점심',
				text: '사장님 직원분들 모두 친절하게 맞이해주셨어요. 그런데 다들 바쁘셔서 음식 나오는 속도가 좀 늦어요ㅠㅠ',
				type: '음식',
			};
		})
		.filter((review) => review.type === st);

	return (
		<div className="bg-grey-10">
			<div className="max-w-[375px] w-full overflow-y-auto flex flex-col items-center rounded-md bg-white">
				{/* 상단: 리뷰 요약 */}
				<div className="flex w-full px-11 py-4 items-center justify-between">
					<div className="flex flex-col items-start">
						<div className="flex items-center mb-1 ml-2">
							<span className="text-grey-80 text-sm">
								{store?.ratingNumber}
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
									{store?.rating?.toFixed(1)}
								</span>
							</div>

							<div className="flex flex-col text-xs text-gray-500 gap-2 -mt-5">
								{[
									{
										label: '청결',
										value: store?.cleanrating ?? 0,
										color: 'bg-green-400',
									},
									{
										label: '음식',
										value: store?.foodrating ?? 0,
										color: 'bg-blue-400',
									},
									{
										label: '서비스',
										value: store?.servicerating ?? 0,
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
				{/* 탭 영역 */}

				<div className="flex gap-2 w-full px-4 mb-4 rounded-md h-full bg-white">
					{TABS.map((tab) => {
						const [label, count] = tab.split(' ');
						const isSelected = selectedTab === tab;
						return (
							<button
								key={tab}
								className={`px-4 py-2 rounded-full text-sm ${
									isSelected
										? 'bg-grey-90 text-white'
										: 'bg-grey-10 text-grey-70'
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
					{filteredReviews.length > 0 ? (
						filteredReviews.map((review) => (
							<ReviewCard key={review.id} review={review} />
						))
					) : (
						<div className="text-center text-gray-500 text-sm">
							해당 카테고리에 대한 리뷰가 없습니다.
						</div>
					)}
				</div>
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
