'use client';

import { useEffect, useState } from 'react';

import { geocodeAddress } from '@/features/locationsetting/lib/geocode';
import { useMap } from '@/features/map/model/useMap';
import { Marker } from '@/features/map/ui/Marker';

interface Props {
	address: string;
	onMarkerClick?: () => void;
}

export default function SearchLocationMap({ address, onMarkerClick }: Props) {
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

	return (
		<div className="relative w-full h-[400px]">
			<div id="map" className="w-full h-full rounded-lg shadow-md" />
			{map && position && (
				<Marker map={map} position={position} onClick={onMarkerClick} />
			)}
		</div>
	);
}
