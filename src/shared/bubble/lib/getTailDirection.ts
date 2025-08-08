import { Direction } from '../model/direction';

/**
 * @description 상대 좌표 비율에 따른 툴팁 방향
 * @link https://seobbang.atlassian.net/browse/TOKTOT-248?atlOrigin=eyJpIjoiNzdiOTkwZjcxNjZjNDM5NWFmNTY3YjEwN2U4OTI2YzciLCJwIjoiaiJ9
 */

export function getTailDirection(
	x: number, // 0~100 (%)
	y: number, // 0~100 (%)
): Direction {
	if (y < 33) {
		if (x < 33) return 'bottom-right';
		if (x < 66) return 'center-bottom';
		return 'bottom-left';
	} else if (y < 66) {
		if (x < 33) return 'top-right';
		if (x < 66) return 'center-top';
		return 'top-left';
	} else {
		if (x < 33) return 'top-right';
		if (x < 66) return 'center-top';
		return 'top-left';
	}
}
