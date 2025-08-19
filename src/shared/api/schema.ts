import { z } from 'zod';

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
	z.object({
		success: z.boolean(),
		data: z.union([dataSchema, z.null()]).optional(),
		message: z.string().optional(),
		errorCode: z.string().optional(),
	});
