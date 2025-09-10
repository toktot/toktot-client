'use client';

import type { KyInstance } from 'ky';

import { ApiError } from '@/shared/api/ApiError';

import {
	BlockUserPayload,
	BlockUserPayloadSchema,
	BlockUserResponseSchema,
} from './schema';

export const createBlockApi = (kyInstance: KyInstance) => ({
	/**
	 * 특정 사용자를 차단합니다.
	 */
	async blockUser(payload: BlockUserPayload): Promise<void> {
		const validatedPayload = BlockUserPayloadSchema.parse(payload);

		const raw = await kyInstance
			.post('v1/blocks/users', { json: validatedPayload })
			.json();

		const parsed = BlockUserResponseSchema.safeParse(raw);

		if (!parsed.success) {
			throw new ApiError('차단 API 응답 형식이 올바르지 않습니다.');
		}

		if (!parsed.data.success) {
			// API가 에러 메시지를 보내준 경우
			throw new ApiError(
				parsed.data.message,
				parsed.data.errorCode ?? undefined,
			);
		}

		// 성공 메시지는 useBlockUser 훅에서 토스트로 처리
	},
});
