'use client';

import { useState } from 'react';

import type { ReviewImage } from '../model/reviewImage';
import { Tooltip } from '../model/tooltip';

export const useReviewImageManager = () => {
	const [images, setImages] = useState<ReviewImage[]>([]);

	const addImage = (file: File) => {
		if (images.length >= 5) return;
		const url = URL.createObjectURL(file);
		const newImage: ReviewImage = {
			id: crypto.randomUUID(),
			file,
			url,
			tooltips: [],
		};
		setImages((prev) => [...prev, newImage]);
	};

	const removeImage = (id: string) => {
		setImages((prev) => prev.filter((img) => img.id !== id));
	};

	const updateTooltip = (imageId: string, tooltip: Tooltip) => {
		setImages((prev) =>
			prev.map((img) => {
				if (img.id !== imageId) return img;

				const existingTooltips = img.tooltips.filter(
					(t) => t.id !== tooltip.id,
				);
				if (existingTooltips.length >= 5) {
					alert('툴팁은 이미지당 최대 5개까지 등록할 수 있습니다.');
					return img;
				}

				return {
					...img,
					tooltips: [...existingTooltips, tooltip],
				};
			}),
		);
	};

	const removeTooltip = (imageId: string, tooltipId: string) => {
		setImages((prev) =>
			prev.map((img) =>
				img.id === imageId
					? {
							...img,
							tooltips: img.tooltips.filter((t) => t.id !== tooltipId),
						}
					: img,
			),
		);
	};

	return {
		images,
		addImage,
		removeImage,
		updateTooltip,
		removeTooltip,
		canAddMore: images.length < 5,
	};
};
