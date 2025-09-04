/**
 * @file 서버 응답을 클라이언트 뷰 모델로 변환하는 매퍼 함수들을 정의합니다.
 * @description 복잡한 데이터 변환 로직을 한 곳에 모아 관리하여, 스키마 정의 파일(schema.ts)을 깔끔하게 유지하고 재사용성을 높입니다.
 */
import {
	BaseReviewImage,
	CleanTooltip,
	FoodTooltip,
	ReviewView,
	SERVER_CATEGORY_MAP,
	ServiceTooltip,
	UploadReviewImage,
} from '@/entities/review';

import { ReviewWriteServerImage } from '@/features/review/write/api/schema';

import {
	ReviewId,
	ReviewImageId,
	TooltipId,
	UserId,
} from '@/shared/model/types';

import type { ReviewServer } from './schema';

/**
 * 서버의 이미지 배열을 클라이언트 뷰모델 이미지 배열로 변환
 */
function mapServerImagesToClient(serverImages: ReviewServer['images']): {
	images: (BaseReviewImage & { tooltipIds: TooltipId[] })[];
} {
	const images: (BaseReviewImage & { tooltipIds: TooltipId[] })[] = [];

	serverImages.forEach((serverImg) => {
		const imageId = String(serverImg.imageId) as ReviewImageId;
		const newImage: BaseReviewImage & { tooltipIds: TooltipId[] } = {
			id: imageId,
			url: serverImg.imageUrl,
			tooltipIds: [],
		};

		images.push(newImage);
	});

	return { images };
}

/**
 * 서버의 Review 응답 전체를 클라이언트의 ReviewView 모델로 변환하는 메인 매퍼 함수
 */
export function mapServerReviewToClientView(
	serverReview: ReviewServer,
): Omit<ReviewView, 'store'> {
	const { images } = mapServerImagesToClient(serverReview.images);

	const tooltips = serverReview.tooltips.map((tooltip) => {
		const clientCategory = SERVER_CATEGORY_MAP[tooltip.type]; // 'FOOD' → 'food'

		const baseTooltip = {
			id: String(tooltip.id) as TooltipId,
			x: 0, // 좌표 데이터는 현재 API에 없으므로 기본값 처리
			y: 0,
			category: clientCategory,
			rating: tooltip.rating,
			description: tooltip.detailedReview,
		};

		if (clientCategory === 'food') {
			return {
				...baseTooltip,
				category: 'food',
				menuName: tooltip.menuName ?? '',
				price: tooltip.totalPrice ?? 0,
				servings: tooltip.servingSize ?? 1,
			} as FoodTooltip;
		} else {
			return {
				...baseTooltip,
				category: clientCategory,
			} as ServiceTooltip | CleanTooltip;
		}
	});

	return {
		id: String(serverReview.id) as ReviewId,
		author: {
			id: serverReview.author.id as UserId,
			nickname: serverReview.author.nickname,
			reviewCount: serverReview.author.reviewCount,
			averageRating: serverReview.author.averageRating,
			profileImageUrl: serverReview.author.profileImageUrl,
		},
		createdAt: serverReview.createdAt,
		images,
		keywords: serverReview.keywords,
		tooltips,
	};
}

/**
 * 서버에서 받은 이미지 배열을 클라이언트의 UploadReviewImage 배열로 변환합니다.
 */
export function mapServerImagesToUploadReviewImages(
	serverImages: ReviewWriteServerImage[],
): UploadReviewImage[] {
	return serverImages.map((serverImage) => ({
		id: serverImage.image_id as ReviewImageId,
		url: serverImage.image_url,
		order: serverImage.order,
	}));
}
