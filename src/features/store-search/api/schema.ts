import { z } from 'zod';

export const PlaceSchema = z.object({
	id: z.number(),
	name: z.string(),
	address: z.string(),
	distance: z.number().nullable(),
	main_menus: z.string().nullable(),
	average_rating: z.number().nullable(),
	review_count: z.number().nullable(),
	is_good_price_store: z.boolean().nullable(),
	is_local_store: z.boolean().nullable(),
	image: z.string().nullable(),
	point: z.any().nullable(), // 'point'와 'percent'의 정확한 타입을 몰라 any로 설정
	percent: z.any().nullable(),
});

export const SearchResponseDataSchema = z.object({
	places: z.array(PlaceSchema),
	current_page: z.number(),
	is_end: z.boolean(),
});

export const SearchRequestPayloadSchema = z.object({
	query: z.string().min(1),
	page: z.number().min(1),
});

export type Place = z.infer<typeof PlaceSchema>;
export type SearchResponseData = z.infer<typeof SearchResponseDataSchema>;
export type SearchRequestPayload = z.infer<typeof SearchRequestPayloadSchema>;
