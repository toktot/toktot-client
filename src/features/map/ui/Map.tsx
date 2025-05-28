'use client';

import { useCurrentLocation } from '@/shared/location/lib/useCurrentLocation';

import { panToPosition } from '../lib/panToPosition';
import { SEOUL_TOUR_SPOTS } from '../model/coordsMock';
import { useMap } from '../model/useMap';
import { CurrentLocationMarker } from './CurrentLocationMarker';
import { Marker } from './Marker';

const Map = () => {
	const { location } = useCurrentLocation();
	const map = useMap('map', {
		center: {
			lat: location?.coords.latitude,
			lng: location?.coords.longitude,
		},
	});

	const goToCurrentLocation = () => {
		if (!map) return;

		panToPosition(map, {
			lat: location?.coords.latitude,
			lng: location?.coords.longitude,
		});
	};

	return (
		<div style={{ width: '500px', height: '500px' }}>
			<div id="map" style={{ width: '100%', height: '100%' }} />
			{map && (
				<>
					{/* 내 위치 마커 */}
					<CurrentLocationMarker map={map} />

					{/* 음식점 마커 */}
					{SEOUL_TOUR_SPOTS.map((spot) => (
						<Marker
							key={spot.id}
							map={map}
							position={spot.position}
							onClick={() => console.log(`클릭한 장소: ${spot.name}`)}
						/>
					))}
					<button onClick={goToCurrentLocation}>내 위치로</button>
				</>
			)}
		</div>
	);
};

export default Map;
