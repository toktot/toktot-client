'use client';

import { Suspense, useState } from 'react';

import { useRouter } from 'next/navigation';

import { BottomNav, BottomNavItem } from '@/widgets/layout';
import { CenterButton } from '@/widgets/layout/ui/BottomNav';

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
		<main className="min-h-screen p-6 bg-white">
			<Suspense fallback={<div>로딩 중...</div>}>
				<HeaderBox onLocationSaved={handleLocationSaved} />
				<div className="flex justify-center items-center gap-2 mr-2">
					<button onClick={() => router.back()}>
						<Icon name="ArrowLeft" className="text-grey-70" />
					</button>

					<SearchBox
						query={text}
						onChange={(val) => {
							setText(val);
						}}
						onSearchClick={() => handleSelect}
						leftIcon={<Icon name="Search" size="s" className="text-grey-50" />}
						rightIcon={<Icon name="Cancel" size="s" className="text-grey-50" />}
						className="w-full max-w-[315px] h-[44px] flex items-start bg-grey-10 text-[14px] text-grey-90"
						rightIconOnClick={handleReset}
					/>
				</div>

				<div className="mt-5">
					<FilterBar value={filter} onChange={setFilter} />
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
			<section>
				<BottomNav>
					<BottomNavItem href="/home" iconName="Home" label="home" />
					<BottomNavItem href="/review" iconName="Review" label="review" />
					<CenterButton href="/write" iconName="Plus" aria-label="plus" />
					<BottomNavItem href="/bookmark" iconName="Route" label="route" />
					<BottomNavItem href="/mypage" iconName="My" label="my" />
				</BottomNav>
			</section>
		</main>
	);
}
