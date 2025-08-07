'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import FilterBar from '@/features/home/components/FilterBar';
import Auto from '@/features/searchBar/components/Auto';

import HeaderBox from '@/shared/components/HeaderBox';
import SearchBox from '@/shared/components/SearchBox';

export default function Search() {
	const [text, setText] = useState('');
	const [filter, setFilter] = useState<number | null>(null);
	const router = useRouter();
	const handleSelect = (text: string) => {
		setText(text);
		router.push(`/search?q=${encodeURIComponent(text)}`);
	};

	return (
		<main className="min-h-screen p-6 bg-white">
			<HeaderBox />
			<SearchBox
				query={text}
				onChange={(val) => {
					setText(val);
				}}
				onSearchClick={() => handleSelect}
			/>
			<div className="mt-5">
				<FilterBar value={filter} onChange={setFilter} />
			</div>
			<Auto query={text} onSelect={handleSelect} />
		</main>
	);
}
