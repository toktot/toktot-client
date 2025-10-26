'use client';

import { useState } from 'react';

import { createFolderApi } from '@/entities/review-folder/api/folder';
import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import toast from 'react-hot-toast';

import { ConfirmModal } from '@/features/report/ui/ConfirmModal';

import { createAuthApi } from '@/shared/api';
import Icon from '@/shared/ui/Icon';
import { getDecryptedToken } from '@/shared/utils/storage';

import { SavedReview } from '../api/schema';
import { useInfiniteSavedReviews } from '../model/useInfiniteSavedReviews';

interface SavedReviewCardProps {
	review: SavedReview;
	folderId: number;
}

const api = createFolderApi(
	createAuthApi({ getToken: () => getDecryptedToken() ?? undefined }),
);

export const SavedReviewCard = ({ review, folderId }: SavedReviewCardProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const removeReview = useInfiniteSavedReviews((state) => state.removeReview);

	const handleConfirmDelete = async () => {
		try {
			await api.removeReviewFromFolder(folderId, review.id);
			removeReview(review.id);
			toast.success('폴더에서 리뷰를 삭제했습니다.');
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : '리뷰 삭제에 실패했습니다.',
			);
		} finally {
			setIsModalOpen(false);
		}
	};

	return (
		<>
			<div className="relative w-full h-[30vh] rounded-lg overflow-hidden shadow-md">
				{review.mainImageUrl ? (
					<Image
						src={review.mainImageUrl}
						alt={`${review.restaurant.name} 리뷰 이미지`}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						priority
					/>
				) : (
					<div className="w-full h-full bg-grey-100 flex items-center justify-center">
						<Icon name="Logo" className="text-grey-300" size="l" />
					</div>
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

				<div className="absolute top-2 right-2">
					<button
						onClick={() => setIsModalOpen(true)}
						className="p-1 rounded-full bg-black/30 text-white hover:bg-black/60"
						aria-label="메뉴"
					>
						<Icon name="Kebab" size="s" />
					</button>
				</div>

				<div className="absolute bottom-0 left-0 right-0 p-3 text-white">
					<h3 className="font-bold text-base truncate">
						{review.restaurant.name}
					</h3>
					<p className="text-xs text-grey-200 truncate">
						{review.restaurant.address}
					</p>
				</div>
			</div>
			<AnimatePresence>
				{isModalOpen && (
					<ConfirmModal
						onClose={() => setIsModalOpen(false)}
						onConfirm={handleConfirmDelete}
						title="이 폴더에서 리뷰를 삭제하시겠습니까?"
						confirmLabel="삭제"
					/>
				)}
			</AnimatePresence>
		</>
	);
};
