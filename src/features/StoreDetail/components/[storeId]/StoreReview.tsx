import { useState } from 'react';

import { mockReviews } from '@/entities/store/model/mockReview';
import { useParams } from 'next/navigation';

import { mockHome } from '@/features/home/model/mockHome';

import Icon from '@/shared/ui/Icon';

import ReviewCard from '../ReviewCard';

export default function StoreReview() {
	// 상단 정보용: mockHome의 첫 번째 데이터 사용 (실제 서비스라면 선택한 가게 정보 사용)
	const params = useParams();
	const storeId = Number(params.storeId);

	const store = mockHome.find((s) => s.id === storeId);
	const TABS = [
		`음식 ${store?.foodNumber}`,
		`서비스 ${store?.serviceNumber}`,
		`청결 ${store?.cleanNumber}`,
	] as const;
	// 탭 상태
	const [selectedTab, setSelectedTab] = useState<(typeof TABS)[number]>(
		`음식 ${store?.foodNumber}`,
	);
	const [st, num] = selectedTab.split(' ');
	console.log(num);
	// 탭에 맞게 리뷰 필터
	const filteredReviews = mockReviews.filter((review) => review.type === st);

	return (
		<div className="max-w-[375px] w-full pl-2 pr-4">
			{/* 상단: 리뷰 요약 */}
			<div className="space-y-4">
				<div className="flex flex-col items-start gap-1">
					<div className="flex items-center">
						<span className="text-grey-80 text-sm">{store?.ratingNumber}</span>
						<span className="text-grey-70 text-[12px]">개 리뷰 평점</span>
					</div>
					<div className="flex items-center gap-1">
						<div className="flex items-center gap-2">
							<Icon name={'Star'} size="xxl" fill="#3AC8FF" stroke="none" />
							<span className="text-3xl text-primary font-bold">
								{store?.rating?.toFixed(1)}
							</span>
						</div>

						<div className="flex flex-col  text-xs text-gray-500 mb-2">
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
									<span className="ml-2 font-semibold">{value.toFixed(1)}</span>
									<span>점</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
			<div className="h-[10px] bg-grey-10 w-full mb-5 mr-2" />
			{/* 탭 영역 */}
			<div className="flex gap-1">
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
			<div className="space-y-4 mt-4">
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
	);
}

/**
 * 평점 그래프 막대 UI 컴포넌트
 */
function Bar({ value, color }: { value: number; color: string }) {
	return (
		<div className="relative w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
			<div
				className={`absolute h-2 rounded-full ${color}`}
				style={{ width: `${Math.min((value / 5) * 100, 100)}%` }}
			/>
		</div>
	);
}
