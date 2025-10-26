import { createAuthApi } from '@/shared/api';
import { getDecryptedToken } from '@/shared/utils/storage';
import { ApiResponseSchema } from '@/shared/api/schema';
import { MenuListSchema, type Menu } from './schema';

const api = createAuthApi({
  getToken: () => getDecryptedToken() ?? undefined,
});

export const getMenusByRestaurantId = async (restaurantId: number): Promise<Menu[]> => {
  const raw = await api.get(`v1/restaurants/${restaurantId}/menus`).json();
  
  const parsed = ApiResponseSchema(MenuListSchema).safeParse(raw);

  if (!parsed.success) {
    throw new Error('메뉴 API 응답 형식이 올바르지 않습니다.');
  }
  if (!parsed.data.success || !parsed.data.data) {
    throw new Error(parsed.data.message ?? '메뉴 목록 조회에 실패했습니다.');
  }
  
  return parsed.data.data;
};
