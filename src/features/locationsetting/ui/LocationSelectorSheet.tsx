// components/LocationSelectorSheet.tsx
'use client';

// 실제 경로에 맞게 수정
import {
	BottomSheet,
	BottomSheetContent,
	BottomSheetOverlay,
	BottomSheetTrigger,
} from '@/shared/components/BottomSheet';

import LocationSelector from './LocationSelector';

// components/LocationSelectorSheet.tsx

// components/LocationSelectorSheet.tsx

export default function LocationSelectorSheet() {
	return (
		<BottomSheet>
			<BottomSheetTrigger>
				{/* 원하는 트리거 버튼으로 교체 가능 */}
				<button className="text-blue-500 underline">장소를 설정해주세요</button>
			</BottomSheetTrigger>

			<BottomSheetOverlay className="fixed inset-0 bg-black/50 z-40" />

			<BottomSheetContent className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl p-4 max-h-[90%] overflow-y-auto">
				{/* 끌 수 있는 바 */}
				<div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
				<LocationSelector />
			</BottomSheetContent>
		</BottomSheet>
	);
}
