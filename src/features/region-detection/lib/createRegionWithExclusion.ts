import { EXCLUDED_AREAS } from '@/entities/region/model/excludedAreas';

import type { Coordinates } from '@/shared/location/model/types';
import { createPolygon } from '@/shared/map/lib/ceratePolygon';

export function createRegionWithExclusion(
	coords: Coordinates[],
	options?: Partial<kakao.maps.PolygonOptions>,
) {
	const regionBoundaryPolygon = createPolygon(coords, {
		strokeWeight: 2,
		strokeColor: 'skyblue',
		strokeOpacity: 0.8,
		strokeStyle: 'solid',
		fillColor: '#67E6FF',
		fillOpacity: 0.4,
		...options,
	});

	const excludedAreaPolygon = createPolygon(EXCLUDED_AREAS.hanlasan, {
		fillColor: '#fff',
		fillOpacity: 0.1,
		strokeOpacity: 0.1,
		strokeStyle: 'shortdashdot',
	});

	return {
		regionBoundaryPolygon,
		excludedAreaPolygon,
	};
}
