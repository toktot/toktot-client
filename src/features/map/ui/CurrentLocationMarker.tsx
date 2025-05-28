import { useCurrentLocation } from '@/shared/location/lib/useCurrentLocation';

import { Marker } from './Marker';

interface Props {
	map: kakao.maps.Map | null;
}

export const CurrentLocationMarker = ({ map }: Props) => {
	const { location, loading, error } = useCurrentLocation();

	if (!map || loading || error || !location) return null;

	return (
		<Marker
			map={map}
			position={{
				lat: location.coords.latitude,
				lng: location.coords.longitude,
			}}
		/>
	);
};
