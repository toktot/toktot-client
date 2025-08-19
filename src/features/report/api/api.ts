import type { KyInstance } from 'ky';

import { ApiError } from '@/shared/api/ApiError';
import { ApiResponseSchema } from '@/shared/api/schema';

import {
	CanReportDataSchema,
	SubmitUserReportDataSchema,
	type UserReportPayload,
	UserReportPayloadSchema,
} from './schema';

export const createReportApi = (kyInstance: KyInstance) => ({
	/**
	 * 특정 사용자를 신고할 수 있는지 확인합니다.
	 */
	async checkCanReport(userId: number): Promise<void> {
		const raw = await kyInstance
			.get(`v1/report/users/${userId}/can-report`)
			.json();
		const parsed = ApiResponseSchema(CanReportDataSchema).safeParse(raw);

		if (!parsed.success) {
			throw new ApiError(
				'신고 가능 여부 확인 API 응답 형식이 올바르지 않습니다.',
				'CLIENT_SCHEMA_ERROR',
			);
		}
		if (!parsed.data.success) {
			throw new ApiError(
				parsed.data.message ?? '신고 대상을 확인할 수 없습니다.',
				parsed.data.errorCode,
			);
		}
	},

	/**
	 * 사용자 신고를 제출합니다.
	 */
	async submitUserReport(payload: UserReportPayload): Promise<void> {
		const validated = UserReportPayloadSchema.parse(payload);
		const raw = await kyInstance
			.post('v1/report/users', { json: validated })
			.json();
		const parsed = ApiResponseSchema(SubmitUserReportDataSchema).safeParse(raw);

		if (!parsed.success) {
			throw new ApiError(
				'신고 제출 API 응답 형식이 올바르지 않습니다.',
				'CLIENT_SCHEMA_ERROR',
			);
		}
		if (!parsed.data.success) {
			throw new ApiError(
				parsed.data.message ?? '신고 접수에 실패했습니다.',
				parsed.data.errorCode,
			);
		}
	},
});
