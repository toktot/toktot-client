import { KyInstance } from 'ky';
import { ApiError } from '@/shared/api/ApiError';
import { ApiResponseSchema } from '@/shared/api/schema';
import {
  SearchRequestPayload,
  SearchRequestPayloadSchema,
  SearchResponseDataSchema,
  PlaceClient,
} from './schema';
import { mapPlaceServerToClient } from './mappers';

export interface SearchClientResponseData {
  places: PlaceClient[];
  currentPage: number;
  isEnd: boolean;
}

export const createStoreSearchApi = (ky: KyInstance) => ({
  async searchStores(payload: SearchRequestPayload): Promise<SearchClientResponseData> {
    const validatedPayload = SearchRequestPayloadSchema.parse(payload);
    const raw = await ky.post('v1/restaurants/search', { json: validatedPayload }).json();
    const parsed = ApiResponseSchema(SearchResponseDataSchema).safeParse(raw);

    if (!parsed.success) {
      throw new ApiError('가게 검색 응답 형식이 올바르지 않습니다.', 'CLIENT_SCHEMA_ERROR');
    }
    if (!parsed.data.success || !parsed.data.data) {
      throw new ApiError(parsed.data.message ?? '가게 검색에 실패했습니다.', parsed.data.errorCode);
    }

    const serverData = parsed.data.data;
    const clientPlaces = serverData.places.map(mapPlaceServerToClient);

    return {
      places: clientPlaces,
      currentPage: serverData.current_page,
      isEnd: serverData.is_end,
    };
  },
});
