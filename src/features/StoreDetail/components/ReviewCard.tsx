import { useState } from 'react';

import { mealOptions } from '@/entities/home/model/mockMealOptions';
import { getTimeAgo } from '@/entities/menu/utils';
import { mockMenu } from '@/entities/store/menu/mockMenu';
import { Reviews, mockReviews } from '@/entities/store/model/mockReview';
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
	const text = review.text;
	const mealInfo = mealOptions.find((m) => m.label === mealTime);
	const sameRatingCount = mockReviews.filter(
		(r) => r.rating === review.rating,
	).length;
	return (
		<div className={'bg-white rounded-3xl p-4 w-full flex flex-col gap-3'}>
			{/* 상단: 프로필 & 시간 */}
			<div className="flex gap-2 tems-center justify-between">
				<div className="flex flex-col">
					<div className=" flex items-center gap-1">
						<span className="font-semibold text-[12px]">{auth.nickname}</span>
						<span className="text-grey-70 text-[11px]">평균 ({rating}점)</span>
						<span className="text-grey-70 text-[11px]">
							{sameRatingCount}개
						</span>
					</div>

					<div className="flex items-center justify-between mt-2 gap-2">
						<StarRating
							value={rating}
							onChange={setRating}
							className="mb-1"
							iconSize="s"
						/>

						<div className="flex items-center text-sm text-grey-50 whitespace-nowrap">
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
				</div>
				<Icon
					name={'Etc'}
					className="top-2 right-2 transform rotate-90 ml-auto text-grey-70"
					size="xs"
				/>
			</div>

			{/* 리뷰 이미지 */}
			<Image
				src={image}
				alt="리뷰 이미지"
				width={65}
				height={65}
				className="rounded-md object-cover w-[65px] h-[65px]"
			/>

			{/* 메뉴 정보 */}
			<div>
				{menu.map((menuName) => {
					const info = mockMenu.find((m) => m.menuName === menuName);

					return (
						<div key={menuName} className="flex justify-between text-sm">
							<span className="space-y-1 bg-grey-20 rounded-2xl px-1 mt-1">
								{menuName}&nbsp;
								{info ? `${info.price.toLocaleString()}원` : '정보 없음'}
							</span>
						</div>
					);
				})}
				<div className="mt-2 mb-3">{text}</div>
			</div>
		</div>
	);
}
