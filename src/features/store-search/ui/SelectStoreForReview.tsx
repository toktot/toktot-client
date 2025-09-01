'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { AppShell, Header } from '@/widgets/layout';

import { BackButton } from '@/features/navigation/back/ui/BackButton';

import Icon from '@/shared/ui/Icon';
import Typography from '@/shared/ui/Typography';

import { Place } from '../api/schema';
import { useStoreSearch } from '../model/useStoreSearch';
import { StoreSearchBar } from './StoreSearchBar';
import { StoreSearchResultCard } from './StoreSearchResultCard';

function useDebounce(value: string, delay: number): string {
	const [debouncedValue, setDebouncedValue] = useState(value);
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);
		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);
	return debouncedValue;
}

export const SelectStoreForReview = () => {
	const router = useRouter();
	const {
		query,
		suggestions,
		results,
		isLoading,
		setQuery,
		fetchSuggestions,
		searchStores,
		clearSuggestions,
		clearResults,
	} = useStoreSearch();

	const [view, setView] = useState<'suggestions' | 'results'>('suggestions');
	const debouncedQuery = useDebounce(query, 1000);

	useEffect(() => {
		if (debouncedQuery.trim() !== '') {
			fetchSuggestions();
		} else {
			clearSuggestions();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedQuery]);

	const handleSearchSubmit = () => {
		if (query.trim() === '') return;
		setView('results');
		clearResults();
		searchStores(true);
	};

	const handleSelectStore = (store: Place) => {
		router.push(`/review/write/${store.id}`);
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
		<AppShell showBottomNav={false}>
			<Header>
				<Header.Left>
					<BackButton />
				</Header.Left>
				<Header.Center>리뷰 쓰기</Header.Center>
			</Header>
			<div className="p-4">
				<Typography as="h1" className="mt-[47px] mb-[12px] font-semibold">
					방문한 가게를
					<br />
					검색해주세요
				</Typography>
				<StoreSearchBar
					query={query}
					onQueryChange={handleQueryChange}
					onSearch={handleSearchSubmit}
				/>
				{view === 'suggestions' && query && (
					<ul className="mt-2 ">
						<li
							className="p-3 cursor-pointer hover:bg-grey-50 flex items-center gap-2"
							onClick={handleSearchSubmit}
						>
							<Icon name="Search" size="xs" />
							<span className="font-semibold">{`'${query}'로 검색`}</span>
						</li>
						{suggestions.map((store) => (
							<li
								key={store.id}
								className="p-3 cursor-pointer hover:bg-grey-50 flex items-center justify-between"
								onClick={() => handleSelectStore(store)}
							>
								<div className=" flex items-center gap-2">
									<Icon name="Location" size="xs" />
									<div className="flex flex-col">
										<span className="font-semibold">{store.name}</span>
										<span className="text-grey-50 text-xs">
											{store.address}
										</span>
									</div>
								</div>
								<Icon name="ArrowRight" size="xs" />
							</li>
						))}
					</ul>
				)}
				{view === 'results' && (
					<div className="mt-4">
						{isLoading && results.length === 0 ? (
							<p>검색 중...</p>
						) : (
							results.map((store) => (
								<StoreSearchResultCard
									key={store.id}
									store={store}
									onSelect={handleSelectStore}
								/>
							))
						)}
						{isLoading && results.length > 0 && <p>더 많은 결과 로드 중...</p>}
					</div>
				)}
			</div>
		</AppShell>
	);
};
