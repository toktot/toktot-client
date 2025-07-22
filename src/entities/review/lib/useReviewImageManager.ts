'use client';

import { useState } from 'react';

import type { ReviewImage } from '../model/reviewImage';

const MAX_IMAGES = 5;

export const useReviewImageManager = () => {
	const [images, setImages] = useState<ReviewImage[]>([]);

	const addImages = (files: FileList) => {
		const currentImageCount = images.length;
		const availableSlots = MAX_IMAGES - currentImageCount;

		if (availableSlots <= 0) {
			alert(`이미지는 최대 ${MAX_IMAGES}개까지 추가할 수 있습니다.`);
			return;
		}

		const filesToAdd = Array.from(files).slice(0, availableSlots);

		const newImages: ReviewImage[] = filesToAdd.map((file) => ({
			id: crypto.randomUUID(),
			file,
			url: URL.createObjectURL(file),
			tooltipIds: [], // tooltips -> tooltipIds
		}));

		setImages((prev) => [...prev, ...newImages]);
	};

	const removeImage = (id: string) => {
		setImages((prev) => prev.filter((img) => img.id !== id));
	};

	const addTooltipToImage = (imageId: string, tooltipId: string) => {
		setImages((prev) =>
			prev.map((img) => {
				if (img.id !== imageId) return img;
				if (img.tooltipIds.length >= 5) {
					alert('툴팁은 이미지당 최대 5개까지 등록할 수 있습니다.');
					return img;
				}
				return { ...img, tooltipIds: [...img.tooltipIds, tooltipId] };
			}),
		);
	};

	const removeTooltipFromImage = (tooltipId: string) => {
		setImages((prev) =>
			prev.map((img) => ({
				...img,
				tooltipIds: img.tooltipIds.filter((id) => id !== tooltipId),
			})),
		);
	};

	return {
		images,
		addImages,
		removeImage,
		addTooltipToImage,
		removeTooltipFromImage,
		canAddMore: images.length < MAX_IMAGES,
	};
};
