'use client';

import { useState } from 'react';

import Map from '@/features/map/ui/Map';
import { RadiusProvider } from '@/features/region-detection/model/RadiusContext';
import DongOverlay from '@/features/region-detection/ui/DongOverlay';
import { RangeSelector } from '@/features/region-detection/ui/RangeSelector';

const MapScreen = () => {
	const [map, setMap] = useState<kakao.maps.Map | null>(null);

	const handleMapLoad = (instance: kakao.maps.Map) => {
		setMap(instance);
	};

	return (
		<section className="flex flex-col items-center gap-10">
			<RadiusProvider>
				<Map onLoad={handleMapLoad} />
				{map && <DongOverlay map={map} />}
				<RangeSelector />
			</RadiusProvider>
		</section>
	);
};

export default MapScreen;
