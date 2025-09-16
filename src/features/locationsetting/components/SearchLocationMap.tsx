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
		console.log('[SearchLocationMap] map or coords changed', {
			map,
			lat,
			lng,
			address,
		});
		if (!map) return;
		const setMapCenter = async () => {
			let coords = null;

			if (lat && lng) {
				coords = { lat, lng };
			} else if (address) {
				coords = await geocodeAddress(address);
			}

			if (!coords) return;

			const latlng = new window.kakao.maps.LatLng(coords.lat, coords.lng);
			map.setCenter(latlng);
			setPosition(coords);
			console.log('[SearchLocationMap] map center set to', coords);
		};

		setMapCenter();
	}, [map, address, lat, lng]);

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
