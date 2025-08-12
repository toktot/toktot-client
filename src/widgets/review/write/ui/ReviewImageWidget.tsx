'use client';

import { useState } from 'react';

import {
	FoodTooltip,
	MAX_IMAGE_COUNT,
	useReviewImageManager,
	useTooltipManager,
} from '@/entities/review';

import {
	CreateReviewSheet,
	type FinalReviewData,
} from '@/widgets/review/write/ui/CreateReviewSheet';

import { ReviewImageBox } from '@/features/review/write/ui/ReviewImageBox';
import { ReviewImageList } from '@/features/review/write/ui/ReviewImageList';
import { ReviewImageUploader } from '@/features/review/write/ui/ReviewImageUploader';
import { ReviewImageWithTooltip } from '@/features/review/write/ui/ReviewImageWithTooltip';

import {
	BottomSheet,
	BottomSheetContent,
	BottomSheetOverlay,
} from '@/shared/components/BottomSheet';
import { ReviewImageId, TooltipId } from '@/shared/model/types';

import { TooltipGuideOverlay } from './TooltipGuideOverlay';

export const ReviewImageWidget = () => {
	const {
		images,
		addImages,
		removeImage,
		addTooltipToImage,
		removeTooltipFromImage,
		canAddMore,
	} = useReviewImageManager();
	console.log('🚀 ~ ReviewImageWidget ~ images:', images);
	const [selectedImageId, setSelectedImageId] = useState<ReviewImageId | null>(
		null,
	);
	const selectedImage =
		images.find((img) => img.id === selectedImageId) ?? images[0];
	const {
		tooltips,
		addTooltip,
		removeTooltip,
		updateTooltipDetails,
		changeTooltipCategory,
	} = useTooltipManager();
	const [showGuide, setShowGuide] = useState(true);

	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const [activeTooltipId, setActiveTooltipId] = useState<TooltipId | null>(
		null,
	);
	const [isCompleted, setIsCompleted] = useState(false);

	const handleRemoveTooltip = (tooltipId: TooltipId) => {
		removeTooltipFromImage(tooltipId);
		removeTooltip(tooltipId);
	};

	const handleImageClick = (coord: { x: number; y: number }) => {
		if (activeTooltipId) {
			alert('먼저 현재 툴팁 작성을 완료해주세요.');
			return;
		}
		if (!selectedImage) return;

		const placeholderTooltip: Omit<FoodTooltip, 'id'> = {
			category: 'food',
			x: coord.x,
			y: coord.y,
			rating: 0,
			menuName: '',
			price: 0,
			description: '',
		};

		const newTooltip = addTooltip(placeholderTooltip);
		addTooltipToImage(selectedImage.id, newTooltip.id);
		setActiveTooltipId(newTooltip.id);
		setIsSheetOpen(true);
	};

	const handleTooltipFormComplete = (formData: FinalReviewData) => {
		if (!activeTooltipId) {
			console.error('업데이트할 활성 툴팁이 없습니다.');
			return;
		}
		updateTooltipDetails(activeTooltipId, formData);

		setActiveTooltipId(null);
		setIsSheetOpen(false);
	};

	const handleSheetOpenChange = (isOpen: boolean) => {
		if (!isOpen && activeTooltipId) {
			removeTooltip(activeTooltipId);
			removeTooltipFromImage(activeTooltipId);
			setActiveTooltipId(null);
		}
		setIsSheetOpen(isOpen);
	};

	if (images.length > 0 && selectedImage && !isCompleted) {
		return (
			<div className="fixed inset-0 z-50 bg-grey-90">
				{showGuide && (
					<TooltipGuideOverlay onDismiss={() => setShowGuide(false)} />
				)}

				<div className="absolute inset-x-0 top-0 bottom-[100px] z-20 rounded-3xl overflow-hidden">
					<ReviewImageWithTooltip
						image={selectedImage}
						onRemoveTooltip={handleRemoveTooltip}
						onImageClick={handleImageClick}
						tooltips={tooltips}
					/>
				</div>
				<div className="absolute bottom-0 left-0 right-0 z-10 h-[100px] flex items-center px-4">
					<div className="h-9 flex justify-between w-full">
						<ReviewImageList
							images={images}
							selectedImageId={selectedImageId}
							onSelectImage={(img) => setSelectedImageId(img.id)}
						/>
						<button
							onClick={() => setIsCompleted(true)}
							className="flex items-center justify-center rounded-2xl bg-primary-40 w-28  h-full"
						>
							완료
						</button>
					</div>
				</div>

				<BottomSheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
					<BottomSheetOverlay className="fixed inset-0 z-40 bg-black/60" />
					<BottomSheetContent className="fixed bottom-0 z-50 w-full max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white shadow-lg">
						<div className="mx-auto my-3 h-1 w-6 rounded-full bg-grey-30" />
						<CreateReviewSheet
							onComplete={handleTooltipFormComplete}
							initialCategory={'food'}
							onCategoryChange={(category) => {
								if (activeTooltipId) {
									changeTooltipCategory(activeTooltipId, category);
								}
							}}
						/>
					</BottomSheetContent>
				</BottomSheet>
			</div>
		);
	}

	return (
		<section className="w-full  space-y-3">
			<h3 className="text-base font-semibold">사진을 등록해주세요</h3>
			<div className="flex items-center h-[100px] gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
				{canAddMore && (
					<div className="h-full flex items-center justify-center">
						<ReviewImageUploader
							onUpload={addImages}
							maxCount={MAX_IMAGE_COUNT}
						/>
					</div>
				)}
				{images.map((image) => (
					<ReviewImageBox
						key={image.id}
						image={image}
						onClick={() => {
							setIsCompleted(false);
							setSelectedImageId(image.id);
						}}
						onDelete={() => removeImage(image.id)}
					/>
				))}
			</div>
		</section>
	);
};
