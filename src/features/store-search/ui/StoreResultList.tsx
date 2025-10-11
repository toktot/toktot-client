'use client';

import { useStoreSearch } from '@/features/store-search/model/useStoreSearch';

import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';

import { PlaceClient } from '../api/schema';
import { StoreSearchResultCard } from './StoreSearchResultCard';

interface StoreResultListProps {
	results: PlaceClient[];
	onSelect: (store: PlaceClient) => void;
	isLoading: boolean;
	isEnd: boolean;
}

export const StoreResultList = ({
	results,
	onSelect,
	isLoading,
	isEnd,
}: StoreResultListProps) => {
	const { searchStores } = useStoreSearch();

	const loadMoreRef = useInfiniteScroll<HTMLDivElement>({
		isLoading,
		hasMore: !isEnd,
		onLoadMore: () => searchStores(false),
		threshold: 1.0,
	});

	return (
		<div className="mt-4">
			{isLoading && results.length === 0 ? (
				<p>검색 중...</p>
			) : (
				results.map((store) => (
					<StoreSearchResultCard
						key={store.id}
						store={store}
						onSelect={onSelect}
					/>
				))
			)}
			{isLoading && results.length > 0 && <p>더 많은 결과 찾는 중...</p>}
			<div ref={loadMoreRef} className="h-10" />
		</div>
	);
};
