'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface MenuInfoCardProps {
	review: {
		id: string;
		menuImageUrl: string;
		menuName: string;
		price: number;
		peopleNumber: string;
	};
}

export default function MenuInfoCard({ review }: MenuInfoCardProps) {
	const router = useRouter();
	const handleClick = () => {
		router.push(`/menu/${review.id}`);
	};
	const numberOnly = parseInt(review.peopleNumber);
	return (
		<div
			className="flex justify-between items-center bg-white w-full max-w-[375px] mx-auto py-3"
			onClick={handleClick}
		>
			<div className="flex flex-col justify-between">
				<div className="text-[16px] font-semibold text-grey-85 mt-1">
					{review.menuName}
				</div>

				<div className="flex items-baseline mt-2">
					<span className="text-grey-90 font-semibold text-[18px] mr-0.5">
						{review.price}
					</span>
					<span className="text-grey-90 text-[12px] mr-2">원</span>
					<span className="text-primary-40 text-[12px] mr-2">
						{review.peopleNumber}
					</span>
				</div>
				<div className="flex itesm-start">
					<span className="text-xs text-grey-60 flex items-center mr-1 text-[12px]">
						1인분 당
					</span>
					<span className="text-grey-80 text-[12px]">
						{review.price / Number(numberOnly)}원
					</span>
				</div>
			</div>
			<Image
				src={review.menuImageUrl}
				alt={`${review.menuName} 이미지`}
				width={85}
				height={85}
				className="rounded-md object-cover "
			/>
		</div>
	);
}
