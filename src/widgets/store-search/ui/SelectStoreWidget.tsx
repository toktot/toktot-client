'use client';

import { useEffect, useState } from 'react';

import { useStoreSearch } from '@/features/store-search/model/useStoreSearch';
import { StoreResultList } from '@/features/store-search/ui/StoreResultList';
import { StoreSearchBar } from '@/features/store-search/ui/StoreSearchBar';
import { StoreSuggestionList } from '@/features/store-search/ui/StoreSuggestionList';
import { PlaceClient } from '@/features/store-search/api/schema';

function useDebounce(value: string, delay: number): string {
	const [debouncedValue, setDebouncedValue] = useState(value);
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);
		return () => clearTimeout(handler);
	}, [value, delay]);
	return debouncedValue;
}

interface SelectStoreWidgetProps {
	onStoreSelect: (store: PlaceClient) => void;
}

export const SelectStoreWidget = ({ onStoreSelect }: SelectStoreWidgetProps) => {
	const {
		query,
		suggestions,
		results,
		isLoading,
		isEnd,
		setQuery,
		fetchSuggestions,
		searchStores,
		clearSuggestions,
		clearResults,
	} = useStoreSearch();

	const [view, setView] = useState<'suggestions' | 'results'>('suggestions');
	const debouncedQuery = useDebounce(query, 300);

	useEffect(() => {
		if (debouncedQuery.trim() !== '') {
			fetchSuggestions();
		} else {
			clearSuggestions();
		}
	}, [debouncedQuery, fetchSuggestions, clearSuggestions]);

	const handleSearchSubmit = () => {
		if (query.trim() === '') return;
		setView('results');
		clearResults();
		searchStores(true);
	};

	const handleQueryChange = (newQuery: string) => {
		setQuery(newQuery);
		if (newQuery.trim() === '') {
			clearResults();
			clearSuggestions();
		}
		setView('suggestions');
	};

	return (
		<div>
			<StoreSearchBar
				query={query}
				onQueryChange={handleQueryChange}
				onSearch={handleSearchSubmit}
			/>
			{view === 'suggestions' && query && (
				<StoreSuggestionList
					query={query}
					suggestions={suggestions}
					onSelectSuggestion={onStoreSelect}
					onSearchSubmit={handleSearchSubmit}
				/>
			)}
			{view === 'results' && (
				<StoreResultList
					results={results}
					onSelect={onStoreSelect}
					isLoading={isLoading}
					isEnd={isEnd}
				/>
			)}
		</div>
	);
};