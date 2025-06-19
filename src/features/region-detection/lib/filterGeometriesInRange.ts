import { isPolygonInRange } from './isPolygonInRange';

type Tm128Point = [number, number];
type Polygon = Tm128Point[];
type MultiPolygon = Tm128Point[][];

type Geometry =
	| { type: 'Polygon'; coordinates: Polygon[] }
	| { type: 'MultiPolygon'; coordinates: MultiPolygon[] };

export function filterGeometriesInRange(
	geometries: Geometry[],
	center: { x: number; y: number },
	radius: number,
): Geometry[] {
	return geometries.filter((geometry) => {
		if (geometry.type === 'Polygon') {
			const outerRing = geometry.coordinates[0];
			return isPolygonInRange(outerRing, center, radius);
		}

		if (geometry.type === 'MultiPolygon') {
			return geometry.coordinates.some((polygon) =>
				isPolygonInRange(polygon[0], center, radius),
			);
		}

		return false;
	});
}
