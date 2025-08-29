import { useState } from 'react';

import { getTimeAgo } from '@/entities/menu/utils';
import Image from 'next/image';

import Icon from '@/shared/ui/Icon';
import StarRating from '@/shared/ui/StarRating';

interface ReviewCardProps {
	review: {
		id: number;
		auth: {
			nickname: string;
			profileImage?: string;
			reviewCount?: number;
			averageRating?: number;
		};
		rating: string;
		image: string;

		date: string;

		text: string;
	};
}

export default function ReviewCard({ review }: ReviewCardProps) {
	const { auth, date, text } = review;
	const [rating, setRating] = useState(
		review.rating ? parseFloat(review.rating) : 0,
	);

	return (
		<div className={'bg-white rounded-3xl p-4 w-full flex flex-col gap-3'}>
			{/* 상단: 프로필 & 시간 */}
			<div className="flex gap-2 tems-center justify-between">
				<div className="flex flex-col">
					<div className=" flex items-center gap-1">
						<span className="font-semibold text-[12px]">{auth.nickname}</span>
						<span className="text-grey-70 text-[11px]">
							평균 ({auth.averageRating?.toFixed(1)}점)
						</span>
						<span className="text-grey-70 text-[11px]">
							({auth.reviewCount}개)
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
							{new Date(date).toLocaleDateString()}
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
				src={review.image}
				alt="리뷰 이미지"
				width={65}
				height={65}
				className="rounded-md object-cover w-[65px] h-[65px]"
			/>

			{/* 메뉴 정보 */}
			<div>
				<div className="mt-2 mb-3">{text}</div>
			</div>
		</div>
	);
}
