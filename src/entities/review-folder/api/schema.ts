import { z } from 'zod';

// 서버 응답 스키마
export const FolderServerSchema = z.object({
	folder_id: z.number(),
	folder_name: z.string(),
	review_count: z.number().optional(),
	created_at: z.string().optional(),
});

// 요청 바디 (create) 스키마 — 클라이언트에서 보내는 것
export const CreateFolderPayloadSchema = z.object({
	folder_name: z.string().max(50),
});

// 요청 바디 (리뷰 저장) 스키마
export const SaveReviewPayloadSchema = z.object({
	folder_ids: z.array(z.number()).min(1),
	review_id: z.number().positive(),
});

// 클라이언트 모델 스키마 (서버 스키마 -> 클라이언트 형식으로 변환)
export const FolderClientSchema = FolderServerSchema.transform((f) => ({
	id: String(f.folder_id),
	name: f.folder_name,
	reviewCount: f.review_count ?? 0,
	createdAt: f.created_at,
}));
