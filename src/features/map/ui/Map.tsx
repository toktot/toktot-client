'use client';

import { useEffect } from 'react';

import { useCurrentLocation } from '@/shared/location/lib/useCurrentLocation';

import { SEOUL_TOUR_SPOTS } from '../model/coordsMock';
import { useMap } from '../model/useMap';
import CurrentLocationButton from './CurrentLocationButton';
import { CurrentLocationMarker } from './CurrentLocationMarker';
import { Marker } from './Marker';
import { MarkerClusterer } from './MarkerClusterer';

interface MapProps {
	onLoad?: (map: kakao.maps.Map) => void;
}

const Map = ({ onLoad }: MapProps) => {
	const { location } = useCurrentLocation();
	const map = useMap('map', {
		center: {
			lat: location?.coords.latitude,
			lng: location?.coords.longitude,
		},
	});

	useEffect(() => {
		if (map && onLoad) {
			onLoad(map);
		}
	}, [map, onLoad]);

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

					{/* 클러스터 마커 */}
					<MarkerClusterer
						map={map}
						positions={SEOUL_TOUR_SPOTS.map((spot) => spot.position)}
					/>

					{/* 내 위치로 이동 버튼 */}
					{location?.coords && (
						<CurrentLocationButton
							map={map}
							coords={{
								lat: location.coords.latitude,
								lng: location.coords.longitude,
							}}
						/>
					)}
				</>
			)}
		</div>
	);
};

export default Map;
