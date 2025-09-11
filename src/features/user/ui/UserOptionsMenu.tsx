'use client';

import { useState } from 'react';

import { useParams, useSearchParams } from 'next/navigation';

import { BlockUserButton } from '@/features/block/ui/BlockUserButton';
import { ReportUserButton } from '@/features/report/user/ui/ReportUserButton';

import {
	BottomSheet,
	BottomSheetContent,
	BottomSheetOverlay,
} from '@/shared/components/BottomSheet';
import Icon from '@/shared/ui/Icon';

export const UserOptionsMenu = () => {
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const params = useParams();
	const searchParams = useSearchParams();
	const nickname = searchParams.get('nickname') ?? '';
	const authorId = Number(params.authorId);

	return (
		<>
			<button onClick={() => setIsSheetOpen(true)}>
				<Icon name={'Kebab'} className="text-black" />
			</button>

			<BottomSheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
				<BottomSheetOverlay className="fixed inset-0 z-40 bg-black/60" />
				<BottomSheetContent className="fixed bottom-0 z-50 w-full max-h-[460px] min-h-40 rounded-t-2xl bg-white shadow-lg px-4">
					<div className="mx-auto my-3 h-1 w-6 rounded-full bg-grey-30" />

					{authorId && (
						<div className="flex flex-col gap-2 pb-10">
							<ReportUserButton
								userId={authorId}
								nickname={nickname}
								className="w-full px-5 py-4 rounded-3xl border border-grey-20 text-left font-semibold"
							/>
							<BlockUserButton
								userId={authorId}
								nickname={nickname}
								className="w-full px-5 py-4 rounded-3xl border border-grey-20 text-left font-semibold text-sub-red-500"
								onSuccess={() => setIsSheetOpen(false)}
							/>
						</div>
					)}
				</BottomSheetContent>
			</BottomSheet>
		</>
	);
};
