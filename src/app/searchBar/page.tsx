'use client';

import { Suspense, useState } from 'react';

import { useRouter } from 'next/navigation';

import { HomeAppShell } from '@/widgets/layout/ui/HomeAppShell';

import FilterBar from '@/features/home/components/FilterBar';
import Auto from '@/features/searchBar/components/Auto';

import HeaderBox from '@/shared/components/HeaderBox';
import SearchBox from '@/shared/components/SearchBox';
import Toast from '@/shared/components/Toast';
import Icon from '@/shared/ui/Icon';

export default function Search() {
	const [text, setText] = useState('');
	const [filter, setFilter] = useState<number | null>(null);
	const router = useRouter();
	const handleSelect = (text: string) => {
		setText(text);
		router.push(`/search?q=${encodeURIComponent(text)}`);
	};
	const handleReset = () => {
		setText('');
	};
	const [showToast, setShowToast] = useState(false);

	const handleLocationSaved = () => {
		setShowToast(true);
	};

	const handleToastClose = () => {
		setShowToast(false);
	};
	return (
		<HomeAppShell showBottomNav={true}>
			<main className="min-h-screen bg-white p-4">
				<HeaderBox onLocationSaved={handleLocationSaved} />
				<Suspense fallback={<div>로딩 중...</div>}>
					<div className="flex justify-center items-center gap-1.5 relative p-3 -mt-3 overflow-y-auto">
						<button onClick={() => router.back()}>
							<Icon name="ArrowLeft" className="text-grey-70 -ml-3" />
						</button>
						<div className="flex justify-center items-center min-w-[315px] max-w-[400px] w-full">
							<SearchBox
								query={text}
								onChange={(val) => {
									setText(val);
								}}
								onSearchClick={() => handleSelect(text)}
								leftIcon={
									<Icon name="Search" size="s" className="text-grey-50" />
								}
								rightIcon={
									<Icon name="Cancel" size="s" className="text-grey-50" />
								}
								className="w-full min-w-[315px] max-w-[400px] h-[44px] flex items-start bg-grey-10 text-[14px] text-grey-90"
								rightIconOnClick={handleReset}
							/>
						</div>
					</div>

					<div className="mt-1 ml-2">
						<FilterBar
							value={filter}
							onChange={setFilter}
							onClick={() => router.push('/searchDetection?from=search')}
						/>
					</div>

					<Auto query={text} onSelect={handleSelect} />
				</Suspense>
				{showToast && (
					<Toast
						message="위치가 설정되었어요."
						duration={2000}
						onClose={handleToastClose}
					/>
				)}
			</main>
		</HomeAppShell>
	);
}
