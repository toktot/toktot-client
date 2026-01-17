'use client';

import { useEffect, useState } from 'react';

import { geocodeAddress } from '@/features/locationsetting/lib/geocode';
import { useMap } from '@/features/map/model/useMap';
import { getAddressFromLatLng } from '@/entities/location/lib/geo'
import { Marker } from '@/features/map/ui/Marker';

interface Props {
	address: string;
	lat?: number;
	lng?: number;
	className?: string;
	isMarkerClicked?: boolean;
	user?: string | null;
	onMarkerClick?: () => void;
	onMapClick?: (coords: {lat: number; lng: number}, address: string) => void;
}

export default function SearchLocationMap({
	address,
	lat,
	lng,
	isMarkerClicked,
	user,
	onMarkerClick,
	onMapClick
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

	useEffect(() => {
		if (!map) return;
		const handleClick = async (mouseEvent: kakao.maps.event.MouseEvent) => {
			const lat = mouseEvent.latLng.getLat();
			const lng = mouseEvent.latLng.getLng();

			setPosition({lat, lng});
			const addr = await getAddressFromLatLng(lat,lng);

			if (addr) {
				onMapClick?.({lat, lng}, addr)
			}
		}
		window.kakao.maps.event.addListener(map, 'click', handleClick);
		return () => {
			window.kakao.maps.event.removeListener(map, 'click', handleClick);
		}
	}, [map, onMapClick])

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
