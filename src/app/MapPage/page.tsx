'use client';

import { useEffect, useState } from 'react';

import { loadKakaoMap } from '@/features/map/lib/loadKakaoMap';
import Map from '@/features/map/ui/Map';
import { RadiusProvider } from '@/features/region-detection/model/RadiusContext';
import DongOverlay from '@/features/region-detection/ui/DongOverlay';
import { RangeSelector } from '@/features/region-detection/ui/RangeSelector';

const MapPage = () => {
	const [mapInstance, setMapInstance] = useState<kakao.maps.Map | null>(null);
	const [mapLoaded, setMapLoaded] = useState(false);

	useEffect(() => {
		loadKakaoMap().then(() => {
			setMapLoaded(true);
		});
	}, []);

	if (!mapLoaded) {
		return <div className="p-4">지도를 불러오는 중입니다...</div>;
	}

	return (
		<RadiusProvider>
			<div className="w-full h-screen flex flex-col items-center gap-6 p-6 bg-white">
				<h1 className="text-xl font-semibold text-gray-700">
					구역 설정 지도 테스트
				</h1>

				{/* 반경 선택 UI */}
				<RangeSelector />

				{/* 지도 */}
				<Map
					onLoad={(map) => {
						setMapInstance(map);
					}}
				/>

				{/* 구역 경계 표시 (행정동 + 한라산 제외영역) */}
				{mapInstance && <DongOverlay map={mapInstance} />}
			</div>
		</RadiusProvider>
	);
};

export default MapPage;
