'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useLocation } from '@/features/locationsetting/ui/LocationContext';
import LocationSelector from '@/features/locationsetting/ui/LocationSelector';

import {
	BottomSheet,
	BottomSheetOverlay,
	BottomSheetTrigger,
} from '@/shared/components/BottomSheet';
import Icon from '@/shared/ui/Icon';

interface HeaderBoxProps {
	onLocationSaved?: () => void;
	user?: string | null;
	bgColorClass?: string;
	open?: boolean;
	setOpen?: (open: boolean) => void;
}

const HeaderBox = ({
	onLocationSaved,
	user,
	bgColorClass = '',
	open,
	setOpen,
}: HeaderBoxProps) => {
	const [internalOpen, setInternalOpen] = useState(false);
	const isOpen = open ?? internalOpen;
	const handleOpenChange = setOpen ?? setInternalOpen;

	const handleClose = () => handleOpenChange(false);
	const { location } = useLocation();
	const [showTooltip] = useState(true);
	const router = useRouter();

	return (
		<BottomSheet open={isOpen} onOpenChange={handleOpenChange}>
			<header
				className={`w-full px-4 py-2 flex items-center justify-between bg-grey-10 ${bgColorClass}`}
			>
				<div className=" relative flex items-center text-sm font-medium text-black">
					<BottomSheetTrigger>
						<div
							className="flex items-center"
							onClick={() => handleOpenChange(true)}
						>
							<span className="text-[16px] font-semibold text-grey-90">
								{location.address || '장소를 설정해주세요.'}
							</span>
							<Icon name="ArrowDown" className="ml-1 text-grey-40 w-5" />
						</div>
					</BottomSheetTrigger>
					{!location.address && showTooltip && (
						<div className="absolute left-1/2 top-full mt-2 w-max -translate-x-1/2 z-10">
							<div className="relative right-[-20px] px-1 py-1.5 rounded-[10px] bg-grey-90 text-xs shadow">
								<div className="flex items-center gap-2">
									<span className="text-primary-40 text-[12px] font-semibold ml-1">
										장소를 입력하면, 가까운 가게가 똑똑!
									</span>
									<span>
										{/*
										<Icon
											name={'Cancel'}
											size="xxs"
											className="text-white"
											onClick={() => setShowTooltip(false)}
										/>
										*/}
									</span>
								</div>
								<div className="absolute left-5 top-0 -translate-x-1/2 -translate-y-full w-0 h-0 border-x-7 border-x-transparent border-b-8 border-t-black"></div>
							</div>
						</div>
					)}
				</div>
				<div>
					<button onClick={() => router.push('/alarm')}>
						<Icon name="Bell" className="w-[48px] h-[48px]" />
					</button>
				</div>
			</header>

			<BottomSheetOverlay className="fixed inset-0 bg-black/50 z-40" />

			<LocationSelector
				onClose={handleClose}
				onLocationSaved={onLocationSaved}
				user={user}
			/>
		</BottomSheet>
	);
};

export default HeaderBox;
