import { useState } from 'react';

import type { ReviewImage } from '../model/reviewImage';

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

	return {
		images,
		addImage,
		removeImage,
		canAddMore: images.length < 5,
	};
};
