import type { Coordinates } from '@/shared/location/model/types';

export function createPolygon(
	map: kakao.maps.Map,
	coords: Coordinates[],
	options?: Partial<kakao.maps.PolygonOptions>,
) {
	const polygon = new kakao.maps.Polygon({
		path: coords.map((c) => new kakao.maps.LatLng(c.lat, c.lng)),
		strokeWeight: 2,
		strokeColor: 'skyblue',
		strokeOpacity: 0.8,
		strokeStyle: 'solid',
		fillColor: '#67E6FF',
		fillOpacity: 0.4,
		...options,
	});

	polygon.setMap(map);
	return polygon;
}
