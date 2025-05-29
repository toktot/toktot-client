export function createMarker({ lat, lng }: { lat: number; lng: number }) {
	return new kakao.maps.Marker({
		position: new kakao.maps.LatLng(lat, lng),
	});
}
