import { z } from 'zod';

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
	z.object({
		success: z.boolean(),
		data: z.optional(z.union([dataSchema, z.array(dataSchema), z.null()])),
		message: z.string().optional(),
		errorCode: z.string().optional(),
	});
