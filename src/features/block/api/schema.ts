'use client';

import { z } from 'zod';

// POST /v1/users/block 요청 본문 스키마
export const BlockUserPayloadSchema = z.object({
	blocked_user_id: z.number(),
});

export type BlockUserPayload = z.infer<typeof BlockUserPayloadSchema>;

// 공통 응답 스키마 (성공 또는 예상된 오류)
export const BlockUserResponseSchema = z.object({
	success: z.boolean(),
	message: z.string(),
	errorCode: z.string().optional().nullable(),
});
