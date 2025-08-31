import { useState } from 'react';

import { useRouter } from 'next/router';

import FilterBar from '@/features/home/components/FilterBar';

import HeaderBox from '@/shared/components/HeaderBox';
import SearchBox from '@/shared/components/SearchBox';

import Auto from './Auto';

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
				className="text-grey-80"
			/>
			<FilterBar
				value={filter}
				onChange={setFilter}
				onClick={() => router.push('/searchDetection?from=search')}
			/>
			<Auto query={text} onSelect={handleSelect} />
		</main>
	);
}
