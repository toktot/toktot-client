'use client';

import { useEffect, useState } from 'react';

import { geocodeAddress } from '@/features/locationsetting/lib/geocode';
import { useMap } from '@/features/map/model/useMap';
import { Marker } from '@/features/map/ui/Marker';

interface Props {
	address: string;
	lat?: number;
	lng?: number;
	className?: string;
	isMarkerClicked?: boolean;
	user?: string | null;
	onMarkerClick?: () => void;
}

export default function SearchLocationMap({
	address,
	lat,
	lng,
	isMarkerClicked,
	user,
	onMarkerClick,
}: Props) {
	const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
		null,
	);
	const map = useMap('map', {
		center: position ?? undefined,
		level: 3,
	});

	useEffect(() => {
		if (!address || !map) return;

		(async () => {
			const coords = await geocodeAddress(address);
			if (!coords) return;

			const { lat, lng } = coords;
			const latlng = new window.kakao.maps.LatLng(lat, lng);

			map.setCenter(latlng);
			setPosition({ lat, lng });
		})();
	}, [address, map]);
	useEffect(() => {
		if (lat && lng && map) {
			const latlng = new window.kakao.maps.LatLng(lat, lng);
			map.setCenter(latlng);
			setPosition({ lat, lng });
		}
	}, [lat, lng, map]);

	return (
		<div className={`relative h-[400px]`}>
			<div id="map" className="w-full h-full " />
			{map && position && (
				<Marker
					map={map}
					position={position}
					onClick={onMarkerClick}
					isMarkerClicked={isMarkerClicked}
					user={user}
				/>
			)}
		</div>
	);
}
