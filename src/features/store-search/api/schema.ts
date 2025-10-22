import { z } from 'zod';

// 서버 응답 원본 스키마
export const PlaceServerSchema = z.object({
	id: z.number(),
	name: z.string(),
	address: z.string(),

	average_rating: z.number().nullish(),
	distance: z.string().nullish(),
	is_good_price_store: z.boolean().nullish(),
	is_local_store: z.boolean().nullish(),
	percent: z.string().nullish(),
	point: z.number().nullish(),
	review_count: z.number().nullish(),
	main_menus: z.string().nullish(), // JSON 문자열로 받음
	image: z.string().nullish(),
});

export const SearchResponseDataSchema = z.object({
	places: z.array(PlaceServerSchema),
	current_page: z.number(),
	is_end: z.boolean(),
});

export const SearchRequestPayloadSchema = z.object({
	query: z.string().min(1),
	page: z.number().min(1),
});

// 클라이언트에서 사용할 메뉴 및 가게 타입
export type ParsedMenus = {
	treatMenu: string;
	firstMenu: string;
};

export type PlaceClient = Omit<
	z.infer<typeof PlaceServerSchema>,
	'main_menus'
> & {
	menus: ParsedMenus;
};

export type SearchRequestPayload = z.infer<typeof SearchRequestPayloadSchema>;
