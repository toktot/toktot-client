import { createMarker } from './createMarker';

type Coordinates = { lat: number; lng: number };

export function clusterMarker(
	map: kakao.maps.Map,
	positions: Coordinates[],
	options?: Partial<kakao.maps.MarkerClustererOptions>,
) {
	if (!map || !positions.length) return;

	const markers = positions.map((pos) => createMarker(pos));

	const clusterer = new kakao.maps.MarkerClusterer({
		map,
		averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
		minLevel: 1, // 클러스터 할 최소 지도 레벨
		...options,
	});

	clusterer.addMarkers(markers);
}
