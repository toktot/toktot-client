'use client';

import StoreCategoryTag from '@/entities/storeCard/components/StoreCategoryTag';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Icon from '@/shared/ui/Icon';

import GasimbiTag from '../model/GasimbiCategory';
import TopPercentTag from '../model/TopPercentTag';

interface GoodPriceStore {
	review: {
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
		percent: number;
	};
}

export default function StoreCardNew({ review }: GoodPriceStore) {
	const router = useRouter();
	const getAveragePrice = (menus: string) => {
		const menuItems = menus.split(',').map((item) => item.trim());
		const prices: number[] = [];
		const names: string[] = [];

		menuItems.forEach((menu) => {
			const match = menu.match(/(.+?)\s*(\d+)/);
			if (match) {
				const name = match[1].trim();
				const price = Number(match[2]);
				names.push(name);
				prices.push(price);
			}
		});
		if (prices.length === 0) return null;

		const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
		return { avg, names };
	};
	const menuInfo = review.main_menus
		? getAveragePrice(review.main_menus)
		: null;

	return (
		<div className="min-w-[343px] max-w-[430px] w-full h-[232px] rounded-t-3xl bg-white overflow-hidden">
			{/* 상단 이미지 */}
			<div
				className="relative min-w-[343px] max-w-[430px] w-full h-[122px] justify"
				onClick={() => router.push(`/storemenu/${review.id}`)}
			>
				{review.image ? (
					<Image
						src={review.image}
						alt={`${review.name} 이미지`}
						fill
						className="object-cover"
					/>
				) : (
					<div className="relative min-w-[343px] max-w-[430px] h-[122px] bg-grey-20 flex items-center justify-center text-grey-60 text-sm rounded-3xl overflow-hidden">
						<div className="flex flex-col flex items-center">
							<span className="">
								<Icon name="KoreanDish" size="xxl"></Icon>
							</span>
							<div className="">사진을 준비하고 있어요</div>
						</div>
					</div>
				)}
				{review.is_good_price_store && (
					<div className="absolute top-0 left-0">
						<StoreCategoryTag
							className="text-[12px] px-2 py-0.4 -ml-1 bg-[#18C094] text-white rounded-tl-3xl rounded-tr-full rounded-br-full rounded-bl-none"
							type="착한가게"
						/>
					</div>
				)}
			</div>

			<div className="flex items-center gap-1 text-xs mt-1">
				{review.percent && <TopPercentTag value={review.percent} />}
				{review.point !== undefined && <GasimbiTag value={review.point} />}
			</div>
			{/* main_menus 오른쪽 작은 글씨 */}
			{menuInfo && (
				<div className="gap-2 ml-2 flex items-center mt-1">
					<span className="text-grey-90 text-[16px] font-semibold">
						{menuInfo.names.join(',')} 약 {menuInfo.avg.toLocaleString()}원
					</span>
				</div>
			)}

			{/* 본문 영역 */}
			<div className="px-2 py-1 flex flex-col gap-1">
				{/* 가게명 + 대표메뉴 */}
				<div className="flex items-center gap-1">
					<span className="text-[14px] text-grey-85">{review.name}</span>

					<Icon
						name="Star"
						size="xxs"
						className="mb-0.5"
						style={{ fill: '#40D7F5', color: '#40D7F5' }}
					/>
					<span className="text-[14px]">
						{review.average_rating.toFixed(1)}
					</span>
					<span className="text-grey-60 text-[14px] mb-0.4 -ml-0.5">
						({review.review_count})
					</span>
				</div>

				{/* 메뉴 가격 (첫 번째 메뉴) */}

				{/* 주소 + 거리 */}
				<div className="text-xs text-grey-70 flex items-center mt-1">
					<Icon name="Location" size="xxs" />
					<span className="ml-1">
						{review.address} · {review.distance}
					</span>
				</div>
			</div>
		</div>
	);
}
