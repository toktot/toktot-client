'use client';

import { z } from 'zod';

// "내가 작성한 리뷰"와 응답 형식이 동일하므로 재사용합니다.
import { MyReviewSchema, MyReviewsPageSchema } from '@/features/my-reviews/api/schema';

export const SavedReviewSchema = MyReviewSchema;
export const SavedReviewsPageSchema = MyReviewsPageSchema;

export type SavedReview = z.infer<typeof SavedReviewSchema>;
export type SavedReviewsPage = z.infer<typeof SavedReviewsPageSchema>;
