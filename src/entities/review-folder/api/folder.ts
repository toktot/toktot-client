import type { KyInstance } from 'ky';
import { z } from 'zod';

import { ApiResponseSchema } from '@/shared/api/schema';

import {
	CreateFolderPayloadSchema,
	FolderClientSchema,
	FolderServerSchema,
	SaveReviewPayloadSchema,
} from './schema';

export type FolderClient = z.infer<typeof FolderClientSchema>;
export type CreateFolderPayload = z.infer<typeof CreateFolderPayloadSchema>;
export type SaveReviewPayload = z.infer<typeof SaveReviewPayloadSchema>;

export const createFolderApi = (kyInstance: KyInstance) => ({
	async createFolder(payload: CreateFolderPayload): Promise<FolderClient> {
		const validated = CreateFolderPayloadSchema.parse(payload);

		const raw = await kyInstance.post('v1/folders', { json: validated }).json();

		const parsed = ApiResponseSchema(FolderServerSchema).safeParse(raw);
		if (!parsed.success) {
			console.error('createFolder: 응답 스키마 불일치', parsed.error.format());
			throw new Error('서버 응답 형식 오류 (createFolder)');
		}

		if (!parsed.data.success) {
			throw new Error(parsed.data.message ?? '폴더 생성 실패');
		}

		const serverData = parsed.data.data as z.infer<typeof FolderServerSchema>;
		const client = FolderClientSchema.parse(serverData);

		return client;
	},

	async getFolders(): Promise<FolderClient[]> {
		const raw = await kyInstance.get('v1/folders').json();
		const parsed = ApiResponseSchema(z.array(FolderServerSchema)).safeParse(
			raw,
		);
		if (!parsed.success) {
			console.error('getFolders: 응답 스키마 불일치', parsed.error.format());
			throw new Error('서버 응답 형식 오류 (getFolders)');
		}
		if (!parsed.data.success)
			throw new Error(parsed.data.message ?? '폴더 목록 조회 실패');

		const serverList = parsed.data.data ?? [];
		return serverList.map((s) => FolderClientSchema.parse(s));
	},

	async saveReviewToFolders(
		payload: SaveReviewPayload,
	): Promise<FolderClient[]> {
		const validated = SaveReviewPayloadSchema.parse(payload);

		const raw = await kyInstance
			.post('v1/folders/review-save', { json: validated })
			.json();
		const parsed = ApiResponseSchema(z.array(FolderServerSchema)).safeParse(
			raw,
		);
		if (!parsed.success) {
			console.error(
				'saveReviewToFolders: 응답 스키마 불일치',
				parsed.error.format(),
			);
			throw new Error('서버 응답 형식 오류 (saveReviewToFolders)');
		}
		if (!parsed.data.success)
			throw new Error(parsed.data.message ?? '리뷰 저장 실패');

		const serverList = parsed.data.data ?? [];
		return serverList.map((s) => FolderClientSchema.parse(s));
	},
});
