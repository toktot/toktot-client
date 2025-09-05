'use client';

import { useState } from 'react';

import { Author } from '@/entities/review/model/author';
import Image from 'next/image';

import { ReportUserButton } from '@/features/report/user/ui/ReportUserButton';

import {
	BottomSheet,
	BottomSheetContent,
	BottomSheetOverlay,
} from '@/shared/components/BottomSheet';

interface ReviewUserProps {
	author: Author;
}

const ReviewUser = ({ author }: ReviewUserProps) => {
	const [isSheetOpen, setIsSheetOpen] = useState(false);

	return (
		<>
			<button
				onClick={() => setIsSheetOpen(true)}
				className="w-full text-left"
				aria-label={`${author.nickname} 상세 옵션 보기`}
			>
				<div className="flex items-start gap-3">
					<div className="flex-shrink-0">
						<Image
							className="w-9 h-9 rounded-full"
							src="/images/mockReview.jpg"
							alt={author.nickname}
							width={100}
							height={100}
						/>
					</div>

					<div className="flex flex-col min-w-0 flex-1">
						<div className="text-sm font-semibold">{author.nickname}</div>
						<div className="mt-1 flex text-xs">
							<p>{author.reviewCount}개</p>
							<div>·</div>
							<p>평균 {author.averageRating}점</p>
						</div>
					</div>
				</div>
			</button>

			<BottomSheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
				<BottomSheetOverlay className="fixed inset-0 z-40 bg-black/60" />
				<BottomSheetContent className="fixed bottom-0 z-50 w-full max-h-[460px] min-h-40 rounded-t-2xl bg-white shadow-lg px-4">
					<div className="mx-auto my-3 h-1 w-6 rounded-full bg-grey-30" />
					<ReportUserButton
						userId={author.id}
						nickname={author.nickname}
						className="w-full px-5 py-4 rounded-3xl border border-grey-20 text-left font-semibold"
					/>
					{/* TODO: 차단하기 추가 */}
				</BottomSheetContent>
			</BottomSheet>
		</>
	);
};

export default ReviewUser;
