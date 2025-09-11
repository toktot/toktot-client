import { useCallback, useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
	isLoading: boolean;
	hasMore: boolean;
	onLoadMore: () => void;
	threshold?: number;
}

export function useInfiniteScroll<T extends HTMLElement>({
	isLoading,
	hasMore,
	onLoadMore,
	threshold = 1.0,
}: UseInfiniteScrollOptions) {
	const observerRef = useRef<IntersectionObserver | null>(null);
	const targetRef = useRef<T | null>(null);

	const handleObserver = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const target = entries[0];
			if (target.isIntersecting && !isLoading && hasMore) {
				onLoadMore();
			}
		},
		[isLoading, hasMore, onLoadMore],
	);

	useEffect(() => {
		if (observerRef.current) observerRef.current.disconnect();

		observerRef.current = new IntersectionObserver(handleObserver, {
			threshold,
		});

		if (targetRef.current) {
			observerRef.current.observe(targetRef.current);
		}

		return () => {
			if (observerRef.current) observerRef.current.disconnect();
		};
	}, [handleObserver, threshold]);

	return targetRef;
}
