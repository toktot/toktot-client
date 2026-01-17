'use client';

import LocationSelector from '@/features/locationsetting/ui/LocationSelector';

import { BottomSheet } from '@/shared/components/BottomSheet';

export default function Page() {
	return (
		<BottomSheet>
			<LocationSelector />
		</BottomSheet>
	);
}
