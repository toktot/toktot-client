import { z } from 'zod';

export const PlaceSchema = z.object({
	id: z.number(),
	name: z.string(),
	address: z.string(),

	distance: z.number().nullish(),
	main_menus: z.string().nullish(),
	average_rating: z.number().nullish(),
	review_count: z.number().nullish(),
	is_good_price_store: z.boolean().nullish(),
	is_local_store: z.boolean().nullish(),
	image: z.string().nullish(),
	point: z.any().nullish(),
	percent: z.any().nullish(),
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
