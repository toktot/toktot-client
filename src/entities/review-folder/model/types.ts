import { ReviewFolderId, ReviewId } from '@/shared/model/types';

export interface ReviewFolder {
	id: ReviewFolderId;
	name: string;
	reviewCount: number;
	isDefault: boolean; // 기본 폴더 여부 (계정 당 하나 존재 변경 불가)
	reviewIds: ReviewId[];
}
