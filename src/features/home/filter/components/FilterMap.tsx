'use client';

import { useEffect } from 'react';

import { SEOUL_TOUR_SPOTS } from '@/features/map/model/coordsMock';
import { useMap } from '@/features/map/model/useMap';
import CurrentLocationButton from '@/features/map/ui/CurrentLocationButton';
import { CurrentLocationMarker } from '@/features/map/ui/CurrentLocationMarker';
import { Marker } from '@/features/map/ui/Marker';
import { MarkerClusterer } from '@/features/map/ui/MarkerClusterer';

import { useCurrentLocation } from '@/shared/location/lib/useCurrentLocation';

interface MapProps {
	onLoad?: (map: kakao.maps.Map) => void;
}

const Map = ({ onLoad }: MapProps) => {
	const { location } = useCurrentLocation();
	const map = useMap('map', {
		center: {
			lat: location?.coords.latitude ?? 33.4996213,
			lng: location?.coords.longitude ?? 126.5311884,
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
