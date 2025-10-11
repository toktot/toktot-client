import { createAuthApi } from '@/shared/api';
import { getDecryptedToken } from '@/shared/utils/storage';
import { ApiResponseSchema } from '@/shared/api/schema';
import { UserProfileServerSchema, UserProfileServer } from './schema';

const api = createAuthApi({ getToken: () => getDecryptedToken() ?? undefined });

export const getMyProfile = async (): Promise<UserProfileServer> => {
  const raw = await api.get('v1/users/me').json();
  const parsed = ApiResponseSchema(UserProfileServerSchema).safeParse(raw);

  if (!parsed.success) {
    throw new Error('내 정보 API 응답 형식이 올바르지 않습니다.');
  }
  if (!parsed.data.success || !parsed.data.data) {
    throw new Error(parsed.data.message ?? '내 정보 조회에 실패했습니다.');
  }
  return parsed.data.data;
};
