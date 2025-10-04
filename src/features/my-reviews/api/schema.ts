'use client';

import { z } from 'zod';

const RestaurantSchema = z.object({
	id: z.number(),
	address: z.string().nullish(),
	name: z.string(),

	representativeMenu: z.string().nullish(),
	distanceInKm: z.number().nullish(),
});

export const MyReviewSchema = z.object({
	authorNickname: z.string(),
	createdAt: z.string(),
	id: z.number(),
	isBookmarked: z.boolean(),
	isWriter: z.boolean(),
	mainImageUrl: z.string().nullish(),
	restaurant: RestaurantSchema,

	authorProfileImageUrl: z.string().nullish(),
});

export const MyReviewsPageSchema = z.object({
	content: z.array(MyReviewSchema),
	last: z.boolean(),
	totalPages: z.number(),
	totalElements: z.number(),
	size: z.number(),
	number: z.number(),
	numberOfElements: z.number(),
	first: z.boolean(),
	empty: z.boolean(),
});

export type MyReview = z.infer<typeof MyReviewSchema>;
export type MyReviewsPage = z.infer<typeof MyReviewsPageSchema>;
