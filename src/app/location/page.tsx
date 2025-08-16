'use client';

import LocationSelector from '@/features/locationsetting/components/LocationSelector';

import { BottomSheet } from '@/shared/components/BottomSheet';

export default function Page() {
	return (
		<BottomSheet>
			<LocationSelector />
		</BottomSheet>
	);
}
