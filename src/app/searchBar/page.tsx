'use client';

import { Suspense, useState } from 'react';

import { useRouter } from 'next/navigation';

import FilterBar from '@/widgets/home/ui/FilterBar';
import { AppShell } from '@/widgets/layout';

import Auto from '@/features/search-bar/ui/Auto';

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
		<AppShell showBottomNav={true}>
			<main className="min-h-screen bg-white pt-[76px] p-4 cursor-pointer">
				<HeaderBox
					onLocationSaved={handleLocationSaved}
					bgColorClass="bg-white fixed top-0 z-80"
				/>
				<Suspense fallback={<div>로딩 중...</div>}>
					<div className="flex justify-center items-center gap-1.5 relative p-3 -mt-3 overflow-y-auto">
						<button onClick={() => router.back()}>
							<Icon
								name="ArrowLeft"
								className="text-grey-70 -ml-3 cursor-pointer"
							/>
						</button>
						<div className="flex justify-center items-center min-w-[315px] max-w-[400px] w-full">
							<SearchBox
								query={text}
								onChange={(val) => {
									setText(val);
								}}
								onSearchClick={() => handleSelect(text)}
								placeholder="검색어를 입력해주세요."
								leftIcon={
									<Icon
										name="Search"
										size="s"
										className="text-grey-50 cursor-pointer"
									/>
								}
								rightIcon={
									<Icon
										name="Cancel"
										size="l"
										className="text-grey-50 cursor-pointer"
									/>
								}
								className="w-full min-w-[315px] max-w-[400px] h-[44px] flex items-start bg-grey-10 text-[14px] text-grey-90 placeholder:text-grey-80"
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
		</AppShell>
	);
}
