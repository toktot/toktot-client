'use client';

import { useState } from 'react';

import Map from '@/features/map/ui/Map';
import { RangeStep } from '@/features/region-detection/model/types';
import DongOverlay from '@/features/region-detection/ui/DongOverlay';
import { RangeSelector } from '@/features/region-detection/ui/RangeSelector';

const MapScreen = () => {
	const [map, setMap] = useState<kakao.maps.Map | null>(null);

	const handleMapLoad = (instance: kakao.maps.Map) => {
		setMap(instance);
	};
	const [radius, setRadius] = useState<RangeStep>(1); // 기본 3km

	return (
		<section className="flex flex-col items-center gap-10">
			<Map onLoad={handleMapLoad} />
			{map && <DongOverlay map={map} />}
			<RangeSelector value={radius} onChange={setRadius} />
		</section>
	);
};

export default MapScreen;
