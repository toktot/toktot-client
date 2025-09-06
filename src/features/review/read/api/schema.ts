import { z } from 'zod';

// =================================================================
// Request: POST /v1/reviews/search
// =================================================================
const LocationFilterSchema = z.object({
	latitude: z.number(),
	longitude: z.number(),
	radius: z.number(),
});

const RatingFilterSchema = z.object({ min: z.number().optional() });

const LocalFoodFilterSchema = z.object({
	type: z.string(),
	minPrice: z.number().optional(),
	maxPrice: z.number().optional(),
});

export const ReviewSearchRequestSchema = z.object({
	location: LocationFilterSchema.optional(),
	rating: RatingFilterSchema.optional(),
	localFood: LocalFoodFilterSchema.optional(),
	keywords: z.array(z.string()).optional(),
	mealTime: z.enum(['BREAKFAST', 'LUNCH', 'DINNER']).optional(),
	sort: z.enum(['RATING', 'DISTANCE', 'POPULARITY', 'SATISFACTION']).optional(),
});

export type SortValue =
	| 'DISTANCE'
	| 'RATING'
	| 'POPULARITY'
	| 'SATISFACTION'
	| undefined;

export type ReviewSearchRequest = z.infer<typeof ReviewSearchRequestSchema>;

// =================================================================
// Response: POST /v1/reviews/search
// =================================================================
const AuthorSchema = z.object({
	id: z.number(),
	nickname: z.string(),
	profileImageUrl: z.string().nullable(),
	reviewCount: z.number(),
	averageRating: z.number(),
});

const TooltipSchema = z.object({
	id: z.number(),
	xPosition: z.number(),
	yPosition: z.number(),
	type: z.enum(['FOOD', 'SERVICE', 'CLEAN']),
	rating: z.number(),
	menuName: z.string().nullable(),
	totalPrice: z.number().nullable(),
	servingSize: z.number().nullable(),
	detailedReview: z.string(),
});

const ImageSchema = z.object({
	imageId: z.string(),
	imageUrl: z.string(),
	imageOrder: z.number(),
	isMain: z.boolean(),
	tooltips: z.array(TooltipSchema),
});

const RestaurantSchema = z.object({
	id: z.number(),
	name: z.string(),
	representativeMenu: z.string().nullable(),
	address: z.string(),
	distanceInKm: z.number().nullable(),
});

const ReviewContentSchema = z.object({
	id: z.number(),
	author: AuthorSchema,
	isBookmarked: z.boolean(),
	isWriter: z.boolean(),
	satisfactionScore: z.number(),
	mealTime: z.string(),
	createdAt: z.string(),
	keywords: z.array(z.string()),
	images: z.array(ImageSchema),
	restaurant: RestaurantSchema,
});

const PageableSchema = z.object({
	pageNumber: z.number(),
	pageSize: z.number(),
	sort: z.object({
		empty: z.boolean(),
		sorted: z.boolean(),
		unsorted: z.boolean(),
	}),
	offset: z.number(),
	paged: z.boolean(),
	unpaged: z.boolean(),
});

export const ReviewSearchResponseDataSchema = z.object({
	content: z.array(ReviewContentSchema),
	pageable: PageableSchema,
	totalPages: z.number(),
	totalElements: z.number(),
	last: z.boolean(),
	size: z.number(),
	number: z.number(),
	sort: z.object({
		empty: z.boolean(),
		sorted: z.boolean(),
		unsorted: z.boolean(),
	}),
	numberOfElements: z.number(),
	first: z.boolean(),
	empty: z.boolean(),
});

export type ReviewSearchResponse = z.infer<
	typeof ReviewSearchResponseDataSchema
>;
export type ReviewContent = z.infer<typeof ReviewContentSchema>;
