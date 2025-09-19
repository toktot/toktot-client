import React, { useState } from 'react';

import Image from 'next/image';

import {
	BottomSheet,
	BottomSheetContent,
} from '@/shared/components/BottomSheet';
import PrimaryButton from '@/shared/components/PrimaryButton';
import Icon from '@/shared/ui/Icon';

import { Review } from '../model/mockHome';

function getTimeAgo(time: string) {
	const now = new Date();
	const past = new Date(time);
	const diff = Math.floor((now.getTime() - past.getTime()) / 1000); // 초 단위

	if (diff < 60) return `${diff}초 전`;
	if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
	if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
	if (diff < 2592000) return `${Math.floor(diff / 86400)}일 전`;
	if (diff < 31104000) return `${Math.floor(diff / 2592000)}개월 전`;
	return `${Math.floor(diff / 31104000)}년 전`;
}

interface ReviewStoreCardProps {
	review: Review;
}
const ReviewStoreCard: React.FC<ReviewStoreCardProps> = ({ review }) => {
	const [selected, setSelected] = useState(false);
	const handleClick = () => {
		setSelected(true);
	};
	return (
		<div className="w-[48%] mb-4">
			<div className="relative w-full h-52 overflow-hidden">
				<Image
					src={
						review.imageUrl && review.imageUrl.trim() !== ''
							? review.imageUrl
							: '/images/foodImage1.png'
					}
					alt={review.placeName}
					fill
					className="object-cover"
				/>
				<Icon
					name={'Etc'}
					className="absolute top-2 right-2 transform rotate-90 text-white"
					onClick={handleClick}
				/>
				<div className="absolute bottom-1 left-3 text-[12px] text-[#FFFFFF] ">
					{review.writer} · {getTimeAgo(review.time ?? '')}
				</div>
			</div>
			<div className="p-2">
				<h3 className="text-sm font-semibold">{review.placeName}</h3>
				<p className="text-xs text-grey-70 flex flex-wrap mt-0.5 flex items-center">
					<Icon name={'Location'} size="xxs" />
					{review.location} · {review.distance}
				</p>
			</div>
			{selected && (
				<BottomSheet open>
					<BottomSheetContent className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl min-h-[40vh] overflow-hidden">
						<div className="flex flex-col rounded-2xl items-center justify gap-2 overflow-y-auto ">
							<div className="w-5 h-[2px] bg-grey-70 rounded-full mx-auto mt-2" />
							<button className="flex w-[343px] justify-start items-start px-4 py-4 border border-grey-20 rounded-xl">
								신고하기
							</button>
							<button className="flex justify-start items-start px-4 py-4 w-[343px] border border-grey-20 rounded-xl">
								차단하기
							</button>
							<PrimaryButton
								text="닫기"
								onClick={() => setSelected(false)}
								className="w-[343px] h-[48px] bg-grey-90 text-white mt-3"
							></PrimaryButton>
							<div className="w-16 h-[1.5px] bg-[#000000] rounded-full mx-auto z-50" />
						</div>
					</BottomSheetContent>
				</BottomSheet>
			)}
		</div>
	);
};
export default ReviewStoreCard;
