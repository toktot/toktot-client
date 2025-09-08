import { UserId } from '@/shared/model/types';

/**
 * @description 다른 도메인에서도 재사용 가능한 범용 사용자 공개 프로필 모델
 */
export interface UserProfile {
	id: UserId;
	nickname: string;
	profileImageUrl?: string | null;
}
