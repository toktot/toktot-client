'use client';

import clsx from 'clsx';

import {
	BottomSheet,
	BottomSheetContent,
	BottomSheetOverlay,
} from '@/shared/components/BottomSheet';

import { SortValue } from '../../read/api/schema';

interface SortBottomSheetProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	currentSort: SortValue;
	onSortChange: (sort: SortValue) => void;
	options: typeof BASE_SORT_OPTIONS;
}

export const BASE_SORT_OPTIONS: { id: string; label: string; value: SortValue }[] = [
	{ id: 'latest', label: '최신순', value: undefined },
	{ id: 'distance', label: '가까운순', value: 'DISTANCE' },
	{ id: 'rating', label: '별점높은순', value: 'RATING' },
	{ id: 'popularity', label: '인기순', value: 'POPULARITY' },
	{ id: 'satisfaction', label: '만족도순', value: 'SATISFACTION' },
];

export const SortBottomSheet = ({
	isOpen,
	onOpenChange,
	currentSort,
	onSortChange,
	options,
}: SortBottomSheetProps) => {
	const handleSelect = (value: SortValue) => {
		onSortChange(value);
		onOpenChange(false);
	};

	return (
		<BottomSheet open={isOpen} onOpenChange={onOpenChange}>
			<BottomSheetOverlay className="fixed inset-0 z-40 bg-black/60" />
			<BottomSheetContent className="fixed bottom-0 z-50 w-full max-h-[460px] min-h-40 rounded-t-2xl bg-white shadow-lg p-4">
				<div className="mx-auto h-1 w-6 rounded-full bg-grey-30" />
				<ul className="flex flex-col gap-2 my-2">
					{options.map((opt) => (
						<li key={opt.id}>
							<button
								onClick={() => handleSelect(opt.value)}
								className={clsx(
									'w-full text-left p-3 rounded-lg text-base',
									currentSort === opt.value
										? 'font-bold text-primary-50 bg-primary-10'
										: 'font-medium text-grey-80 hover:bg-grey-10',
								)}
							>
								{opt.label}
							</button>
						</li>
					))}
				</ul>
				<button
					onClick={() => onOpenChange(false)}
					className="py-3 mx-auto bg-grey-90 text-primary-40 w-full rounded-2xl text-lg font-semibold"
				>
					닫기
				</button>
			</BottomSheetContent>
		</BottomSheet>
	);
};
