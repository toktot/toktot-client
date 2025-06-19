import { DEFAULT_RADIUS } from '../model/constants';

export function isPolygonInRange(
	coords: [number, number][], // TM128 좌표계
	center: { x: number; y: number }, // TM128 기준 중심
	radius = DEFAULT_RADIUS,
) {
	return coords.some(([x, y]) => {
		const dx = x - center.x;
		const dy = y - center.y;
		const distance = Math.sqrt(dx * dx + dy * dy);
		return distance <= radius;
	});
}
