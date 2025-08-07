import { loadKakaoMap } from '@/features/map/lib/loadKakaoMap';

export const geocodeAddress = async (
	address: string,
): Promise<{ lat: number; lng: number } | null> => {
	await loadKakaoMap();

	if (!window.kakao?.maps?.services) {
		console.error('Kakao Maps SDK not loaded.');
		return null;
	}

	const geocoder = new window.kakao.maps.services.Geocoder();

	return new Promise((resolve) => {
		geocoder.addressSearch(address, (result, status) => {
			if (status === window.kakao.maps.services.Status.OK) {
				const lat = parseFloat(result[0].y);
				const lng = parseFloat(result[0].x);
				resolve({ lat, lng });
			} else {
				resolve(null);
			}
		});
	});
};
