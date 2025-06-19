'use client';

import { useEffect, useRef } from 'react';

import { DEFAULT_CENTER } from '@/features/map/model/mapConfig';

import { useCurrentLocation } from '@/shared/location/lib/useCurrentLocation';

import { createPolygon } from '../lib/createPolygon';
import { useTm128Data } from '../lib/useTm128Data';

interface DongOverlayProps {
	map: kakao.maps.Map;
}

const DongOverlay = ({ map }: DongOverlayProps) => {
	const { location } = useCurrentLocation();
	const { data } = useTm128Data({
		center: {
			lat: location?.coords.latitude || DEFAULT_CENTER.lat,
			lng: location?.coords.longitude || DEFAULT_CENTER.lng,
		},
	});
	const polygonsRef = useRef<kakao.maps.Polygon[]>([]);

	useEffect(() => {
		if (!map || !data) return;

		//  기존 폴리곤 제거
		polygonsRef.current.forEach((polygon) => polygon.setMap(null));
		polygonsRef.current = [];

		//  새 폴리곤 생성
		const newPolygons = data.map((coords) => createPolygon(map, coords));

		polygonsRef.current = newPolygons;
	}, [map, data]);

	return null;
};

export default DongOverlay;
