'use client';

import { useEffect, useMemo, useState } from 'react';

import {
	FoodTooltip,
	type InteractiveReviewImage,
	MAX_IMAGE_COUNT,
	MAX_TOOLTIP_COUNT,
	useReviewImageManager,
	useTooltipManager,
} from '@/entities/review';
import { ReviewImageItem } from '@/entities/review';

import {
	CreateReviewSheet,
	type FinalReviewData,
} from '@/widgets/review/write/ui/CreateReviewSheet';

import { ReviewImageBox } from '@/features/review/write/ui/ReviewImageBox';
import { ReviewImageUploader } from '@/features/review/write/ui/ReviewImageUploader';
import { ReviewImageWithTooltip } from '@/features/review/write/ui/ReviewImageWithTooltip';

import {
	BottomSheet,
	BottomSheetContent,
	BottomSheetOverlay,
} from '@/shared/components/BottomSheet';
import { ReviewImageId, TooltipId } from '@/shared/model/types';

import { TooltipGuideOverlay } from './TooltipGuideOverlay';

// TODO: props로 받아오고 페이지에서는 path로 storeId 받아오기
export const ReviewImageWidget = () => {
	const {
		images,
		uploadImages,
		deleteImage,
		initializeImages,
		remainingSlots,
	} = useReviewImageManager(1);
	const {
		tooltips,
		addTooltip,
		removeTooltip,
		updateTooltipDetails,
		changeTooltipCategory,
	} = useTooltipManager();

	const [tooltipsByImageId, setTooltipsByImageId] = useState<
		Record<ReviewImageId, TooltipId[]>
	>({});

	const [selectedImageId, setSelectedImageId] = useState<ReviewImageId | null>(
		null,
	);
	const [activeTooltipId, setActiveTooltipId] = useState<TooltipId | null>(
		null,
	);
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const [showGuide, setShowGuide] = useState(true);

	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		initializeImages();
	}, [initializeImages]);

	const interactiveImages: InteractiveReviewImage[] = useMemo(() => {
		return images.map((img) => ({
			...img,
			tooltipIds: tooltipsByImageId[img.id] || [],
		}));
	}, [images, tooltipsByImageId]);

	const selectedImage = interactiveImages.find(
		(img) => img.id === selectedImageId,
	);

	const handleDeleteImage = (imageId: ReviewImageId) => {
		const tooltipIdsToDelete = tooltipsByImageId[imageId] || [];
		tooltipIdsToDelete.forEach((tooltipId) => removeTooltip(tooltipId));

		setTooltipsByImageId((prev) => {
			const newRelations = { ...prev };
			delete newRelations[imageId];
			return newRelations;
		});

		deleteImage(imageId);
	};

	const handleRemoveTooltip = (tooltipId: TooltipId) => {
		removeTooltip(tooltipId);
		setTooltipsByImageId((prev) => {
			return Object.keys(prev).reduce(
				(acc, imageId) => {
					const filteredIds = prev[imageId as ReviewImageId].filter(
						(id: TooltipId) => id !== tooltipId,
					);
					if (filteredIds.length > 0) {
						acc[imageId as ReviewImageId] = filteredIds;
					}
					return acc;
				},
				{} as Record<ReviewImageId, TooltipId[]>,
			);
		});
	};

	const handleImageClick = (coord: { x: number; y: number }) => {
		if (activeTooltipId) {
			alert('먼저 현재 툴팁 작성을 완료해주세요.');
			return;
		}
		if (!selectedImage) return;
		if (selectedImage.tooltipIds.length >= MAX_TOOLTIP_COUNT) {
			alert(
				`툴팁은 이미지당 최대 ${MAX_TOOLTIP_COUNT}개까지 추가할 수 있습니다.`,
			);
			return;
		}

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
		setTooltipsByImageId((prev) => ({
			...prev,
			[selectedImage.id]: [...(prev[selectedImage.id] || []), newTooltip.id],
		}));

		setActiveTooltipId(newTooltip.id);
		setIsSheetOpen(true);
	};

	const handleTooltipFormComplete = (formData: FinalReviewData) => {
		if (!activeTooltipId) return;
		updateTooltipDetails(activeTooltipId, formData);
		setActiveTooltipId(null);
		setIsSheetOpen(false);
	};

	const handleSheetOpenChange = (isOpen: boolean) => {
		if (!isOpen && activeTooltipId) {
			handleRemoveTooltip(activeTooltipId);
			setActiveTooltipId(null);
		}
		setIsSheetOpen(isOpen);
	};

	if (isEditing) {
		return (
			<div className="fixed inset-0 z-50 bg-grey-90">
				{showGuide && (
					<TooltipGuideOverlay onDismiss={() => setShowGuide(false)} />
				)}

				<div className="absolute inset-x-0 top-0 bottom-[100px] z-20 rounded-3xl overflow-hidden">
					{selectedImage && (
						<ReviewImageWithTooltip
							image={selectedImage}
							tooltips={tooltips}
							onImageClick={handleImageClick}
							onRemoveTooltip={handleRemoveTooltip}
						/>
					)}
				</div>

				<div className="absolute bottom-0 left-0 right-0 z-10 h-[100px] flex items-center px-4">
					<div className="h-9 flex justify-between w-full">
						<div className="flex-1 overflow-x-auto">
							<div className="flex h-full items-center space-x-2">
								{images.map((image) => (
									<div key={image.id} className="relative flex-shrink-0">
										<ReviewImageItem
											image={image}
											isSelected={image.id === selectedImageId}
											onSelect={() => setSelectedImageId(image.id)}
										/>
									</div>
								))}
							</div>
						</div>
						<button
							onClick={() => setIsEditing(false)}
							className="flex items-center justify-center rounded-2xl bg-primary-40 w-28 h-full ml-4 flex-shrink-0"
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
		<section className="w-full space-y-3">
			<h3 className="text-base font-semibold">사진을 등록해주세요</h3>
			<div className="flex items-center h-[100px] gap-2">
				<div className="h-full flex items-center justify-center">
					<ReviewImageUploader
						onUpload={uploadImages}
						maxCount={remainingSlots ?? MAX_IMAGE_COUNT - images.length}
					/>
				</div>
				<div className="flex h-full gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
					{images.map((image) => (
						<ReviewImageBox
							key={image.id}
							image={{
								...image,
								tooltipIds: tooltipsByImageId[image.id] || [],
							}}
							onClick={() => {
								setSelectedImageId(image.id);
								setIsEditing(true);
							}}
							onDelete={() => handleDeleteImage(image.id)}
						/>
					))}
				</div>
			</div>
		</section>
	);
};
