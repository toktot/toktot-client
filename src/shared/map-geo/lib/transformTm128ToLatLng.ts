import proj4 from 'proj4';

import type { Coordinates } from '@/shared/location/model/types';

// TM128 (GRS80 기반) 좌표계 등록

proj4.defs(
	'ESPG:5186',
	'+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs',
);

/**
 * TM128(GRS80, EPSG:5186) → WGS84 변환
 */
export async function transformTm128ToLatLng(
	x: number,
	y: number,
): Promise<Coordinates> {
	const [lng, lat] = proj4('ESPG:5186', 'WGS84', [x, y]);
	return { lat, lng };
}
