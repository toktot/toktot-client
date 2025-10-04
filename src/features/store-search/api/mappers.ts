import { z } from 'zod';

import { ParsedMenus, PlaceClient, PlaceServerSchema } from './schema';

const defaultMenus: ParsedMenus = { treatMenu: '', firstMenu: '' };

export function mapPlaceServerToClient(
	place: z.infer<typeof PlaceServerSchema>,
): PlaceClient {
	let parsedMenus: ParsedMenus;
	try {
		// JSON 문자열 파싱 시도
		parsedMenus = place.main_menus
			? JSON.parse(place.main_menus)
			: defaultMenus;
	} catch (e) {
		// 파싱 실패 시 기본값 사용
		console.error('Menu JSON parsing error:', e);
		parsedMenus = defaultMenus;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { main_menus, ...restOfPlace } = place;

	return {
		...restOfPlace,
		menus: parsedMenus,
	};
}
