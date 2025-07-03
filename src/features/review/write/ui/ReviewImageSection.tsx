'use client';

import { useEffect, useState } from 'react';

import { useReviewImageManager } from '@/entities/review/lib/useReviewImageManager';
import { ReviewImage } from '@/entities/review/model/reviewImage';

import { ReviewImageList } from './ReviewImageList';
import { ReviewImageUploader } from './ReviewImageUploader';
import { ReviewImageWithTooltip } from './ReviewImageWithTooltip';

const ReviewImageSection = () => {
	const [selectedImage, setSelectedImage] = useState<ReviewImage | null>(null);
	const {
		images,
		addImage,
		removeImage,
		canAddMore,
		updateTooltip,
		removeTooltip,
	} = useReviewImageManager();

	//FIXME: selectedImage를 업데이트된 images와 동기화 시켜주기 위한 useEffect 로직 개선 필요
	useEffect(() => {
		if (!selectedImage) return;
		const updated = images.find((img) => img.id === selectedImage.id);
		if (updated && updated !== selectedImage) {
			setSelectedImage(updated);
		}
	}, [images, selectedImage]);

	return (
		<section>
			<div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
				{canAddMore && <ReviewImageUploader onUpload={addImage} />}
				<ReviewImageList
					images={images}
					onSelectImage={setSelectedImage}
					onDeleteImage={removeImage}
				/>
			</div>

			{selectedImage && (
				<ReviewImageWithTooltip
					image={selectedImage}
					onClose={() => setSelectedImage(null)}
					onUpdateTooltip={updateTooltip}
					onRemoveTooltip={removeTooltip}
				/>
			)}
		</section>
	);
};

export default ReviewImageSection;
