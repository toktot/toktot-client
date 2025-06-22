import { useEffect, useState } from 'react';

import proj4 from 'proj4';

import { Coordinates } from '@/shared/location/model/types';
import { transformTm128ToLatLng } from '@/shared/map-geo/lib/transformTm128ToLatLng';

import { useRadius } from '../model/RadiusContext';
import { fetchGeojson } from './fetchGeojson';
import { filterGeometriesInRange } from './filterGeometriesInRange';

interface UseTm128DataProps {
	center: Coordinates; // 위경도 기준
	radius?: number;
}

export function useTm128Data({ center }: UseTm128DataProps) {
	const [data, setData] = useState<Coordinates[][] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { radius } = useRadius();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const geojson = await fetchGeojson();

				// WGS84 → TM128으로 중심점 변환
				const [x, y] = proj4('WGS84', 'ESPG:5186', [center.lng, center.lat]);
				const centerTM128 = { x, y };

				// TM128 기준 반경 필터링
				const filtered = filterGeometriesInRange(
					geojson.geometries,
					centerTM128,
					radius,
				);

				// 필터링된 도형만 변환
				const polygons: Coordinates[][] = [];

				for (const geometry of filtered) {
					if (geometry.type === 'Polygon') {
						const outerRing = geometry.coordinates[0];
						const converted = await Promise.all(
							outerRing.map(([x, y]) => transformTm128ToLatLng(x, y)),
						);
						polygons.push(converted);
					} else if (geometry.type === 'MultiPolygon') {
						for (const ring of geometry.coordinates) {
							const outerRing = ring[0];
							const converted = await Promise.all(
								outerRing.map(([x, y]) => transformTm128ToLatLng(x, y)),
							);
							polygons.push(converted);
						}
					}
				}

				setData(polygons);
			} catch (e) {
				setError((e as Error).message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [center.lat, center.lng, radius]);

	return { data, loading, error };
}
