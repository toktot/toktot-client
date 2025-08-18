import { z } from 'zod';

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
	z.object({
		success: z.boolean(),
		data: z.union([dataSchema, z.null()]),
		message: z.string(),
		errorCode: z.string().optional(),
	});
