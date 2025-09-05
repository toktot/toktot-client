import { KyInstance } from 'ky';

import { ApiError } from '@/shared/api/ApiError';
import { ApiResponseSchema } from '@/shared/api/schema';

import {
	SearchRequestPayload,
	SearchRequestPayloadSchema,
	SearchResponseData,
	SearchResponseDataSchema,
} from './schema';

export const createStoreSearchApi = (ky: KyInstance) => ({
	/**
	 * 가게를 검색합니다.
	 */
	async searchStores(
		payload: SearchRequestPayload,
	): Promise<SearchResponseData> {
		const validatedPayload = SearchRequestPayloadSchema.parse(payload);

		const raw = await ky
			.post('v1/restaurants/search', {
				json: validatedPayload,
			})
			.json();

		const parsed = ApiResponseSchema(SearchResponseDataSchema).safeParse(raw);

		if (!parsed.success) {
			throw new ApiError(
				'가게 검색 응답 형식이 올바르지 않습니다.',
				'CLIENT_SCHEMA_ERROR',
			);
		}

		if (!parsed.data.success) {
			throw new ApiError(
				parsed.data.message ?? '가게 검색에 실패했습니다.',
				parsed.data.errorCode,
			);
		}

		if (!parsed.data.data) {
			throw new ApiError('검색 결과 데이터가 비어있습니다.', 'NO_DATA');
		}

		return parsed.data.data;
	},
});
