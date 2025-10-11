import { createAuthApi } from '@/shared/api';
import { ApiError } from '@/shared/api/ApiError';
import { ApiResponseSchema } from '@/shared/api/schema';
import { getDecryptedToken } from '@/shared/utils/storage';
import { z } from 'zod';

const api = createAuthApi({
	getToken: () => getDecryptedToken() ?? undefined,
});

export const uploadMenuImagesApi = async (
	restaurantId: string,
	files: File[],
): Promise<void> => {
	const formData = new FormData();
	files.forEach((file) => {
		formData.append('files', file);
	});

	const raw = await api
		.post(`v1/restaurants/${restaurantId}/menu-images`, {
			body: formData,
		})
		.json();

	const parsed = ApiResponseSchema(z.null()).safeParse(raw);

	if (!parsed.success || !parsed.data?.success) {
		throw new ApiError(
			parsed.data?.message ?? '메뉴판 이미지 업로드에 실패했습니다.',
			parsed.data?.errorCode,
		);
	}
};
