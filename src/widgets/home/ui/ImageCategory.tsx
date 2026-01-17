'use client';

import { Reviews } from '@/entities/store/model/mockReview';

interface Props {
	score?: number;
	reviews: Reviews[];
}
export const getGasimbiStyle = (value?: number) => {
	if (!value) return { text: '', border: '' };

	if (value >= 80) {
		return {
			text: 'bg-clip-text text-transparent bg-gradient-to-r from-[#00C79F] to-[#006218]',
			border: 'border-2 border-gradient-to-r from-[#00C79F] to-[#006218]',
		};
	} else if (value >= 50) {
		return {
			text: 'bg-clip-text text-transparent bg-gradient-to-r from-[#006FFF] to-[#3AC8FF]',
			border: 'border-2 border-gradient-to-r from-[#00C79F] to-[#006218',
		};
	} else if (value >= 30) {
		return {
			text: 'bg-clip-text text-transparent bg-gradient-to-r from-[#FFB885] to-[#FF6600]',
			border: 'border-2 border-gradient-to-r from-[#FFB885] to-[#FF6600]',
		};
	} else {
		return {
			text: 'text-gray-500',
			border: '',
		};
	}
};

export default function ImageCategory({ reviews, score }: Props) {
	// 가심비 점수에 따라 gradient 색상과 border 결정

	return (
		<div className="flex flex-col gap-4">
			{reviews.map((review) => {
				const gasimbiScore = review.gasimbi ?? score; // 개별 리뷰 점수가 없으면 props score 사용
				const style = getGasimbiStyle(gasimbiScore);

				return (
					<div key={review.id} className="">
						<div
							className={`inline-flex items-center gap-2 rounded-full py-[0.5px]`}
						>
							<div className="flex items-center gap-1 rounded-full bg-white px-2 py-[1px]">
								<span className="font-semibold">
									{review.auth.nickname}님의 가심비
								</span>
								{gasimbiScore !== undefined && (
									<span className={`text-xs font-semibold ${style.text} `}>
										{gasimbiScore}점
									</span>
								)}
							</div>
						</div>
						<div className="mt-2 text-sm text-gray-700">
							{review.textString}
						</div>
					</div>
				);
			})}
		</div>
	);
}
