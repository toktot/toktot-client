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
		<>
			<Map onLoad={handleMapLoad} />
			{map && <DongOverlay map={map} />}
		</>
	);
};

export default MapScreen;
