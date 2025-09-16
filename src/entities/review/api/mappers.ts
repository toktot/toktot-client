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
	Tooltip,
	UploadReviewImage,
} from '@/entities/review';
import { StoreData } from '@/entities/store';

import type { ReviewContent } from '@/features/review/read/api/schema';
import { ReviewWriteServerImage } from '@/features/review/write/api/schema';

import {
	ReviewId,
	ReviewImageId,
	StoreId,
	TooltipId,
	UserId,
} from '@/shared/model/types';

import { Author } from '../model/author';

/**
 * 서버의 Review 응답 전체를 클라이언트의 ReviewView 모델로 변환하는 메인 매퍼 함수
 */
export function mapReviewContentToView(content: ReviewContent): ReviewView {
	const tooltips: Record<TooltipId, Tooltip> = {};
	const images: (BaseReviewImage & { tooltipIds: TooltipId[] })[] = [];

	content.images.forEach((serverImg) => {
		const imageId = serverImg.imageId as ReviewImageId;
		const imageTooltipIds: TooltipId[] = [];

		serverImg.tooltips.forEach((serverTooltip) => {
			const tooltipId = String(serverTooltip.id) as TooltipId;
			const clientCategory = SERVER_CATEGORY_MAP[serverTooltip.type];

			const baseTooltip = {
				id: tooltipId,
				x: serverTooltip.xPosition,
				y: serverTooltip.yPosition,
				category: clientCategory,
				rating: serverTooltip.rating,
				description: serverTooltip.detailedReview,
			};

			if (clientCategory === 'food') {
				tooltips[tooltipId] = {
					...baseTooltip,
					category: 'food',
					menuName: serverTooltip.menuName ?? '',
					price: serverTooltip.totalPrice ?? 0,
					servings: serverTooltip.servingSize ?? 1,
				} as FoodTooltip;
			} else {
				tooltips[tooltipId] = {
					...baseTooltip,
					category: clientCategory,
				} as ServiceTooltip | CleanTooltip;
			}
			imageTooltipIds.push(tooltipId);
		});

		images.push({
			id: imageId,
			url: serverImg.imageUrl,
			tooltipIds: imageTooltipIds,
		});
	});

	const author: Author = {
		id: content.author.id as UserId,
		nickname: content.author.nickname,
		profileImageUrl:
			content.author.profileImageUrl ?? '/images/avatar_default.png',
		reviewCount: content.author.reviewCount,
		averageRating: content.author.averageRating,
	};

	const store: StoreData = {
		id: String(content.restaurant.id) as StoreId,
		storeName: content.restaurant.name,
		mainMenu: content.restaurant.representativeMenu ?? '대표 메뉴 정보 없음',
		address: content.restaurant.address ?? '주소 정보 없음',
	};

	return {
		id: String(content.id) as ReviewId,
		author,
		store,
		createdAt: content.createdAt,
		images,
		keywords: content.keywords,
		tooltips,
		satisfactionScore: content.satisfactionScore,
		mealTime: content.mealTime,
		isBookmarked: content.isBookmarked,
		isWriter: content.isWriter,
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
