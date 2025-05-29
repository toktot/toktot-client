import { panToPosition } from '../lib/panToPosition';
import { Coordinates } from '../model/types';

interface CurrentLocationButtonProps {
	map: kakao.maps.Map;
	coords?: Coordinates;
}

const CurrentLocationButton = ({ map, coords }: CurrentLocationButtonProps) => {
	const goToCurrentLocation = () => {
		if (!map || !coords) return;

		panToPosition(map, {
			lat: coords.lat,
			lng: coords.lng,
		});
	};

	return (
		<button
			onClick={goToCurrentLocation}
			className="cursor-pointer m-3 border p-2 bg-blue-300 text-white rounded-2xl"
		>
			내 위치로
		</button>
	);
};

export default CurrentLocationButton;
