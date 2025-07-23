'use client';

import { useState } from 'react';

import {
	MAX_IMAGE_COUNT,
	Tooltip,
	useReviewImageManager,
	useTooltipManager,
} from '@/entities/review';

import {
	CreateReviewSheet,
	type FinalReviewData,
} from '@/widgets/review/create-review-sheet/ui/CreateReviewSheet';

import { ReviewImageBox } from '@/features/review/write/ui/ReviewImageBox';
import { ReviewImageList } from '@/features/review/write/ui/ReviewImageList';
import { ReviewImageUploader } from '@/features/review/write/ui/ReviewImageUploader';
import { ReviewImageWithTooltip } from '@/features/review/write/ui/ReviewImageWithTooltip';

import {
	BottomSheet,
	BottomSheetContent,
	BottomSheetOverlay,
} from '@/shared/components/BottomSheet';

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
	const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
	const selectedImage =
		images.find((img) => img.id === selectedImageId) ?? images[0];
	const { tooltips, addTooltip, removeTooltip } = useTooltipManager();
	const [showGuide, setShowGuide] = useState(true);

	// const handleAddTooltip = (
	// 	imageId: string,
	// 	coord: { x: number; y: number },
	// ) => {
	// 	// TODO: 목데이터 삭제 후 카테고리 별 추가
	// 	// switch (tooltip.category) {
	// 	// 	case 'food':
	// 	// 		return ;
	// 	// 	case 'service':
	// 	// 		return ;
	// 	// 	case 'clean':
	// 	// 		return ;
	// 	// }

	// 	const tooltip = addTooltip({
	// 		x: coord.x,
	// 		y: coord.y,
	// 		category: 'food',
	// 		rating: 4,
	// 		// 100자
	// 		description:
	// 			'글자수 초과시 인풋박스 안 텍스트 입니다.글자수 초과시 인풋박스 안 텍스트 입니다.글자수 초과시 인풋박스 안 텍스트 입니다.글자수 초과시 인풋박스 안 텍스트 입니다.글dsfdsfd',
	// 	});
	// 	addTooltipToImage(imageId, tooltip.id);
	// };

	const handleRemoveTooltip = (tooltipId: string) => {
		removeTooltipFromImage(tooltipId);
		removeTooltip(tooltipId);
	};

	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const [newTooltipCoords, setNewTooltipCoords] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const [isCompleted, setIsCompleted] = useState(false);

	const handleImageClick = (coord: { x: number; y: number }) => {
		setNewTooltipCoords(coord);
		setIsSheetOpen(true);
	};

	const handleTooltipFormComplete = (formData: FinalReviewData) => {
		if (!newTooltipCoords || !selectedImage) return;

		// 폼 데이터와 좌표를 조합하여 새로운 툴팁 데이터를 만듭니다.
		const newTooltipData: Omit<Tooltip, 'id'> = {
			x: newTooltipCoords.x,
			y: newTooltipCoords.y,
			category: formData.category,
			rating: formData.rating,
			description: formData.detailedText,
			// 'food' 카테고리일 경우 추가 정보 매핑
			...(formData.category === 'food' &&
			formData.formData &&
			'menuName' in formData.formData
				? {
						menuName: formData.formData.menuName,
						price: formData.formData.price,
					}
				: {}),
		};

		const newTooltip = addTooltip(newTooltipData);
		addTooltipToImage(selectedImage.id, newTooltip.id);

		// 상태 초기화 및 바텀시트 닫기
		setIsSheetOpen(false);
		setNewTooltipCoords(null);
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
							onSelectImage={(img) => setSelectedImageId(img.id)}
							onDeleteImage={removeImage}
						/>
						<button
							onClick={() => setIsCompleted(true)}
							className="flex items-center justify-center rounded-2xl bg-primary-40 w-28  h-full"
						>
							완료
						</button>
					</div>
				</div>

				<BottomSheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
					<BottomSheetOverlay className="fixed inset-0 z-40 bg-black/60" />
					<BottomSheetContent className="fixed bottom-0 z-50 w-full max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white shadow-lg">
						<div className="mx-auto my-3 h-1 w-6 rounded-full bg-grey-30" />
						<CreateReviewSheet onComplete={handleTooltipFormComplete} />
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
					/>
				))}
			</div>
		</section>
	);
};
