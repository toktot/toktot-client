'use client';

import { useState } from 'react';

import { useLocation } from '@/features/locationsetting/components/LocationContext';
import LocationSelector from '@/features/locationsetting/components/LocationSelector';

import {
	BottomSheet,
	BottomSheetOverlay,
	BottomSheetTrigger,
} from '@/shared/components/BottomSheet';
import Icon from '@/shared/ui/Icon';

interface HeaderBoxProps {
	onLocationSaved?: () => void;
	user?: string | null;
}

const HeaderBox = ({ onLocationSaved, user }: HeaderBoxProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleClose = () => setIsOpen(false);
	const { location } = useLocation();
	const [showTooltip, setShowTooltip] = useState(true);

	return (
		<BottomSheet open={isOpen} onOpenChange={setIsOpen}>
			<header className="w-full px-4 py-3 flex items-center justify-between bg-white">
				<div className=" relative flex items-center text-sm font-medium text-black">
					<BottomSheetTrigger>
						<div className="flex items-center" onClick={() => setIsOpen(true)}>
							<span>{location.address || '위치를 설정해주세요.'}</span>
							<Icon name="ArrowDown" className="ml-1 text-grey-40 w-5" />
						</div>
					</BottomSheetTrigger>
					{!location.address && showTooltip && (
						<div className="absolute left-1/2 top-full mt-2 w-max -translate-x-1/2 z-10">
							<div className="relative right-[-47px] px-2 py-1 rounded-[10px] bg-grey-90 text-xs shadow">
								<div className="flex items-center gap-2">
									<span className="text-primary-40">
										장소를 입력하면, 가까운 가게가 똑똣!
									</span>
									<span>
										<Icon
											name={'Cancel'}
											size="xxs"
											className="text-white"
											onClick={() => setShowTooltip(false)}
										/>
									</span>
								</div>
								<div className="absolute left-5 top-0 -translate-x-1/2 -translate-y-full w-0 h-0 border-x-7 border-x-transparent border-b-8 border-t-black"></div>
							</div>
						</div>
					)}
				</div>
				<div>
					<Icon name="Bell" />
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
