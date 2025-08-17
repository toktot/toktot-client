import { Coordinates } from '@/shared/location/model/types';

const HANLASAN_POLYGON: Coordinates[] = [
	{ lat: 33.325928, lng: 126.646186 },
	{ lat: 33.4051, lng: 126.717343 },
	{ lat: 33.425819, lng: 126.648786 },
	{ lat: 33.424438, lng: 126.535551 },
	{ lat: 33.436275, lng: 126.427516 },
	{ lat: 33.374506, lng: 126.372434 },
	{ lat: 33.290366, lng: 126.529641 },
];

export const EXCLUDED_AREAS = {
	hanlasan: HANLASAN_POLYGON,
};
