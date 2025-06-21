import { Coordinates } from '@/shared/location/model/types';

export function createMarker({ lat, lng }: Coordinates) {
	return new kakao.maps.Marker({
		position: new kakao.maps.LatLng(lat, lng),
	});
}
