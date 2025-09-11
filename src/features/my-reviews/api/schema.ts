'use client';

import { z } from 'zod';

const RestaurantSchema = z.object({
	id: z.number(),
	name: z.string(),
	representativeMenu: z.string().nullish(),
	address: z.string(),
	distanceInKm: z.number().nullish(),
});

export const MyReviewSchema = z.object({
	id: z.number(),
	mainImageUrl: z.string().nullish(),
	authorProfileImageUrl: z.string().nullish(),
	authorNickname: z.string(),
	createdAt: z.string(),
	restaurant: RestaurantSchema,
	isBookmarked: z.boolean(),
	isWriter: z.boolean(),
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
