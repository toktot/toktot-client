'use client';

import { useState } from 'react';

export const useImagePagination = (imageCount: number) => {
	const [currentIndex, setCurrentIndex] = useState(0);

	const goToNext = () => {
		setCurrentIndex((prev) => (prev + 1) % imageCount);
	};

	const goToPrevious = () => {
		setCurrentIndex((prev) => (prev - 1 + imageCount) % imageCount);
	};

	return { currentIndex, goToNext, goToPrevious };
};
