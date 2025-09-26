'use client';

import { useEffect, useMemo, useState } from 'react';

import { Tooltip } from '@/entities/review';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useLocation } from '@/features/locationsetting/components/LocationContext';
import {
	ReviewSearchRequest,
	SortValue,
} from '@/features/review/read/api/schema';
import { useReviewFeedStore } from '@/features/review/read/hooks/useReviewFeedStore';
import { useReviewPagination } from '@/features/review/read/lib/useImagePagination';
import { BASE_SORT_OPTIONS } from '@/features/review/sort/ui/SortBottomSheet';

export const useReviewStoryFeedController = () => {
	const { reviews, fetchNextPage, setFilters } = useReviewFeedStore();
	const [sort, setSort] = useState<SortValue>(undefined);
	const { location } = useLocation();

	const availableSortOptions = useMemo(() => {
		if (location.lat && location.lng) {
			return BASE_SORT_OPTIONS;
		}
		return BASE_SORT_OPTIONS.filter((opt) => opt.value !== 'DISTANCE');
	}, [location.lat, location.lng]);

	useEffect(() => {
		if (sort === 'DISTANCE' && (!location.lat || !location.lng)) {
			setSort(undefined); // Reset
		}
	}, [location.lat, location.lng, sort]);

	useEffect(() => {
		const newFilters: ReviewSearchRequest = { sort };
		if (sort === 'DISTANCE' && location.lat && location.lng) {
			newFilters.location = {
				latitude: location.lat,
				longitude: location.lng,
				radius: 10000, // 10km
			};
		}
		setFilters(newFilters);
	}, [sort, setFilters, location.lat, location.lng]);

	const currentSortOption = BASE_SORT_OPTIONS.find((opt) => opt.value === sort);

	const { page, direction, paginate, setPage } = useReviewPagination(
		0,
		reviews.length,
	);
	const currentIndex = page;

	const [showGuide, setShowGuide] = useState(true);
	const [selectedTooltip, setSelectedTooltip] = useState<Tooltip | null>(null);
	const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
	const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);

	const handleTooltipClick = (tooltip: Tooltip) => {
		setSelectedTooltip((prev) => (prev?.id === tooltip.id ? null : tooltip));
	};

	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const currentPost = reviews[currentIndex];

	useEffect(() => {
		setPage(0);
	}, [sort, setPage]);

	useEffect(() => {
		if (!currentPost?.id) return;
		const params = new URLSearchParams(searchParams.toString());
		params.set('reviewId', currentPost.id);
		params.set('authorId', String(currentPost.author.id));

		router.replace(pathname + '?' + params.toString());
	}, [currentPost, pathname, router, searchParams]);

	const handleSortChange = (newSort: SortValue) => {
		setSort(newSort);
		setIsSortSheetOpen(false);
	};

	return {
		states: {
			reviews,
			currentPost,
			currentIndex,
			direction,
			showGuide,
			selectedTooltip,
			isSheetOpen,
			isSortSheetOpen,
			currentSortOption,
			sort,
			availableSortOptions,
		},
		handlers: {
			paginate,
			fetchNextPage,
			setShowGuide,
			handleTooltipClick,
			setIsSheetOpen,
			setIsSortSheetOpen,
			handleSortChange,
		},
	};
};
