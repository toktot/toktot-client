/**
 * @file 서버 응답을 클라이언트 뷰 모델로 변환하는 매퍼 함수들을 정의합니다.
 * @description 복잡한 데이터 변환 로직을 한 곳에 모아 관리하여, 스키마 정의 파일(schema.ts)을 깔끔하게 유지하고 재사용성을 높입니다.
 */
import {
	BaseReviewImage,
	ReviewView,
	UploadReviewImage,
} from '@/entities/review';
import { StoreData } from '@/entities/store';
import { MoodKeyword } from '@/entities/store/mood/model/types';

import { ReviewWriteServerImage } from '@/features/review/write/api/schema';

import {
	MoodKeywordId,
	ReviewId,
	ReviewImageId,
	TooltipId,
	UserId,
} from '@/shared/model/types';

// --- 타입 정의 ---
// 이 파일에서만 사용할 서버 응답의 타입을 간략하게 정의합니다.
// 실제 Zod 스키마는 schema.ts에 있습니다.
interface ServerUser {
	id: number;
	nickname: string;
	profileImageUrl: string | null;
}
interface ServerMenu {
	menuName: string;
	totalPrice: number;
}
interface ServerImage {
	id: number;
	imageUrl: string;
	menus: ServerMenu[];
}
interface ServerReview {
	id: number;
	user: ServerUser;
	images: ServerImage[];
	keywords: string[];
	createdAt: string;
	isWriter: boolean;
}

// --- 매퍼 함수들 ---
/**
 * 서버의 `keywords` (string[])를 클라이언트의 `moodKeywords` (MoodKeyword[])로 변환합니다.
 * @description 현재 API 명세에는 키워드의 ID가 없으므로, 프론트엔드에서 미리 정의된 맵을 사용하거나 임시 ID를 부여합니다.
 */
const KEYWORD_TO_ID_MAP: Record<string, MoodKeywordId> = {
	로컬: 1 as MoodKeywordId,
	아늑한: 2 as MoodKeywordId,
	'현지인이 많은': 3 as MoodKeywordId,
	트렌디한: 4 as MoodKeywordId,
	한적한: 5 as MoodKeywordId,
};
function mapServerKeywordsToMoodKeywords(keywords: string[]): MoodKeyword[] {
	return keywords
		.map((label) => {
			const id = KEYWORD_TO_ID_MAP[label];
			return id ? { id, label } : null;
		})
		.filter((kw): kw is MoodKeyword => kw !== null);
}

function mapServerImagesToClient(serverImages: ServerImage[]): {
	images: (BaseReviewImage & { tooltipIds: TooltipId[] })[];
} {
	const images: (BaseReviewImage & { tooltipIds: TooltipId[] })[] = [];

	serverImages.forEach((serverImg) => {
		const imageId = String(serverImg.id) as ReviewImageId;
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
	serverReview: ServerReview,
): Omit<ReviewView, 'tooltips'> {
	const { images } = mapServerImagesToClient(serverReview.images);
	const moodKeywords = mapServerKeywordsToMoodKeywords(serverReview.keywords);

	return {
		id: String(serverReview.id) as ReviewId,
		author: {
			id: serverReview.user.id as UserId,
			nickname: serverReview.user.nickname,
			reviewCount: 0,
			averageRating: 0,
			profileImageUrl: null,
		},
		store: {} as StoreData, // 가게 정보는 이 API에 없으므로, 상위 컴포넌트에서 주입해야 함
		createdAt: serverReview.createdAt,
		images,
		moodKeywords,
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
