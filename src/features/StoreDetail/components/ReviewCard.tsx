import { useState } from 'react';

import { mealOptions } from '@/entities/home/model/mockMealOptions';
import { getTimeAgo } from '@/entities/menu/utils';
import { mockMenu } from '@/entities/store/menu/mockMenu';
import { Reviews } from '@/entities/store/model/mockReview';
import Image from 'next/image';

import Icon from '@/shared/ui/Icon';
import StarRating from '@/shared/ui/StarRating';

interface ReviewCardProps {
	review: Reviews;
}

export default function ReviewCard({ review }: ReviewCardProps) {
	const { auth, image, menu, date, mealTime } = review;
	const [rating, setRating] = useState(
		review.rating ? parseFloat(review.rating) : 0,
	);
	const mealInfo = mealOptions.find((m) => m.label === mealTime);

	return (
		<div className="mt-4 bg-white w-full max-w-[375px]">
			{/* 상단: 프로필 & 시간 */}
			<div className="flex justify-between items-center">
				<div className="flex flex-col">
					<span className="font-semibold">{auth.nickname}</span>
					<StarRating value={rating} onChange={setRating} className="mt-1" />
				</div>
				<div className="flex items-center text-sm text-grey-50 mt-6 justify-end whitespace-nowrap">
					{mealInfo && (
						<>
							<Icon name={mealInfo.iconName} />
							<span>{mealInfo.label}</span>
						</>
					)}
					<span>・</span>
					<span>{getTimeAgo(date)}</span>
				</div>
			</div>

			{/* 리뷰 이미지 */}
			<Image
				src={image}
				alt="리뷰 이미지"
				width={65}
				height={65}
				className="w-full rounded-md object-cover"
			/>

			{/* 메뉴 정보 */}
			<div>
				{menu.map((menuName) => {
					const info = mockMenu.find((m) => m.menuName === menuName);
					return (
						<div key={menuName} className="flex justify-between text-sm">
							<span className="space-y-1 bg-grey-10 rounded-xl">
								{menuName}&nbsp;
								{info ? `${info.price.toLocaleString()}원` : '정보 없음'}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
