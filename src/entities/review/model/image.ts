import { z } from 'zod';

import { ReviewImageId, TooltipId } from '@/shared/model/types';

export interface BaseReviewImage {
	id: ReviewImageId;
	url: string;
}

/**
 * @description '리뷰 작성' 컨텍스트처럼 상호작용이 필요한 경우에 사용되는 확장 모델.
 *              툴팁 정보와 원본 파일 정보를 포함합니다.
 */
export interface InteractiveReviewImage extends BaseReviewImage {
	tooltipIds: TooltipId[];
}

export type ReviewImage = InteractiveReviewImage;

export interface UploadReviewImage extends BaseReviewImage {
	order: number;
}

// 서버에서 내려주는 이미지 객체 타입
export interface ServerImage {
	image_id: ReviewImageId;
	image_url: string;
	order: number;
}

// Zod 스키마 정의
export const ServerImageSchema = z.object({
	image_id: z.string(),
	image_url: z.string(),
	order: z.number(),
});

// ServerImage를 UploadReviewImage로 변환하는 Zod 스키마
export const UploadReviewImageSchema = ServerImageSchema.transform(
	(serverImage): UploadReviewImage => ({
		id: serverImage.image_id as ReviewImageId,
		url: serverImage.image_url,
		order: serverImage.order,
	}),
);
