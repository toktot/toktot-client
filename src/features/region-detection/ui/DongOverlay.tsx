'use client';

import { useEffect, useRef } from 'react';

import { useCurrentLocation } from '@/shared/location/lib/useCurrentLocation';
import { DEFAULT_CENTER } from '@/shared/location/model/constants';

import { createRegionWithExclusion } from '../lib/createRegionWithExclusion';
import { useTm128Data } from '../lib/useTm128Data';

interface DongOverlayProps {
	map: kakao.maps.Map;
}

const DongOverlay = ({ map }: DongOverlayProps) => {
	const { location } = useCurrentLocation();
	console.log(location);
	const { data } = useTm128Data({
		center: {
			lat: DEFAULT_CENTER.lat,
			lng: DEFAULT_CENTER.lng,
		},
	});
	const polygonsRef = useRef<kakao.maps.Polygon[]>([]);

	useEffect(() => {
		if (!map || !data) return;

		//  기존 폴리곤 제거
		polygonsRef.current.forEach((polygon) => polygon.setMap(null));
		polygonsRef.current = [];

		//  새 폴리곤 생성
		const newPolygons: kakao.maps.Polygon[] = [];
		data.forEach((coords) => {
			const { regionBoundaryPolygon, excludedAreaPolygon } =
				createRegionWithExclusion(coords);

			regionBoundaryPolygon.setMap(map);
			excludedAreaPolygon.setMap(map);

			newPolygons.push(regionBoundaryPolygon, excludedAreaPolygon);
		});

		polygonsRef.current = newPolygons;
	}, [map, data]);

	return null;
};

export default DongOverlay;
