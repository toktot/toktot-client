import { KyInstance } from 'ky';

import { ApiError } from '@/shared/api/ApiError';
import { ApiResponseSchema } from '@/shared/api/schema';
import { StoreId } from '@/shared/model/types';

import { Store, StoreClientSchema } from './storeSchema';

export const createStoreApi = (kyInstance: KyInstance) => ({
	/**
	 * ID로 특정 가게의 상세 정보를 조회합니다.
	 */
	async getStoreById(storeId: StoreId): Promise<Store> {
		const raw = await kyInstance.get(`v1/restaurants/${storeId}`).json();

		const parsed = ApiResponseSchema(StoreClientSchema).safeParse(raw);

		if (!parsed.success) {
			throw new ApiError(
				'가게 정보 응답 형식이 올바르지 않습니다.',
				'CLIENT_SCHEMA_ERROR',
			);
		}

		if (!parsed.data.success) {
			throw new ApiError(
				parsed.data.message ?? '가게 정보를 불러오는 데 실패했습니다.',
				parsed.data.errorCode,
			);
		}

		if (!parsed.data.data) {
			throw new ApiError('가게 정보 데이터가 비어있습니다.', 'NO_DATA');
		}

		return parsed.data.data;
	},
});
