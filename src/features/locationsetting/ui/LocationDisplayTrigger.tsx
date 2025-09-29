'use client';

import { useState } from 'react';

import clsx from 'clsx';

import { useLocation } from '@/features/locationsetting/components/LocationContext';
import LocationSelector from '@/features/locationsetting/components/LocationSelector';

import {
	BottomSheet,
	BottomSheetOverlay,
	BottomSheetTrigger,
} from '@/shared/components/BottomSheet';
import Icon from '@/shared/ui/Icon';

interface LocationDisplayTriggerProps {
	className?: string;
}

export const LocationDisplayTrigger = ({
	className,
}: LocationDisplayTriggerProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const { location } = useLocation();

	const handleClose = () => setIsOpen(false);

	return (
		<BottomSheet open={isOpen} onOpenChange={setIsOpen}>
			<BottomSheetTrigger>
				<div className={clsx('flex items-center', className)}>
					<span className="max-w-[300px] truncate">
						{location.address || '위치를 설정해주세요.'}
					</span>
					<Icon name="ArrowDown" className="ml-1 w-5" />
				</div>
			</BottomSheetTrigger>

			<BottomSheetOverlay className="fixed inset-0 bg-black/50 z-40" />
			<LocationSelector onClose={handleClose} />
		</BottomSheet>
	);
};
