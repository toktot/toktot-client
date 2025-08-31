import { z } from 'zod';

// --- 서버 응답 스키마 ---
const ReviewWriteServerImageSchema = z.object({
	image_id: z.string(),
	image_url: z.string(),
	file_size: z.number(),
	order: z.number(),
});

const SessionDataSchema = z.object({
	id: z.number(),
	images: z.array(ReviewWriteServerImageSchema),
	total_image_count: z.number(),
	remaining_slots: z.number(),
	has_session: z.boolean(),
});

export const ImageUploadResponseSchema = z.object({
	uploaded_images: z.array(ReviewWriteServerImageSchema),
	all_images: z.array(ReviewWriteServerImageSchema),
	total_image_count: z.number(),
	remaining_slots: z.number(),
});

export const ReviewSubmitResponseSchema = z.object({
	review_id: z.number(),
	restaurant_id: z.number(),
});

// --- 서버 요청 스키마 ---
const TooltipPayloadSchema = z.object({
	type: z.enum(['FOOD', 'SERVICE', 'CLEAN']),
	x: z.number(),
	y: z.number(),
	rating: z.number(),
	detailed_review: z.string().optional(),
	menu_name: z.string().optional(),
	total_price: z.number().optional(),
	serving_size: z.number().optional(),
});

const ImagePayloadSchema = z.object({
	image_id: z.string(),
	order: z.number(),
	is_main: z.boolean(),
	tooltips: z.array(TooltipPayloadSchema).optional(),
});

export const ReviewSubmitPayloadSchema = z.object({
	id: z.number(),
	value_for_money_score: z.number(),
	keywords: z.array(z.string()),
	meal_time: z.string(),
	images: z.array(ImagePayloadSchema),
});

export type SessionData = z.infer<typeof SessionDataSchema>;

export const ImageDeleteResponseSchema = SessionDataSchema;
export const ImageSessionResponseSchema = SessionDataSchema;
export const ImageSessionClearDataSchema = z.literal('cleared');

export type ImageUploadData = z.infer<typeof ImageUploadResponseSchema>;
export type ReviewSubmitData = z.infer<typeof ReviewSubmitResponseSchema>;
export type ReviewSubmitPayload = z.infer<typeof ReviewSubmitPayloadSchema>;
export type ReviewWriteServerImage = z.infer<
	typeof ReviewWriteServerImageSchema
>;
