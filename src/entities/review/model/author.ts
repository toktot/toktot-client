import { UserProfile } from '@/entities/user/model/types';

/**
 * @description 리뷰 도메인에서 사용되는 '작성자' 모델.
 */
export interface Author extends UserProfile {
	reviewCount: number;
	averageRating: number;
}
