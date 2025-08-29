'use client';

import { useState } from 'react';

import Map from '@/features/map/ui/Map';
import DongOverlay from '@/features/region-detection/ui/DongOverlay';

const MapScreen = () => {
	const [map, setMap] = useState<kakao.maps.Map | null>(null);

	const handleMapLoad = (instance: kakao.maps.Map) => {
		setMap(instance);
	};

	return (
		<section className="flex flex-col items-center gap-10">
			<Map onLoad={handleMapLoad} />
			{map && <DongOverlay map={map} />}
		</section>
	);
};

export default MapScreen;
