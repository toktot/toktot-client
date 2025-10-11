import { z } from 'zod';

export const UserProfileServerSchema = z.object({
  nickname: z.string(),
  review_count: z.number(),
  review_rating_avg: z.number(),
  profile_image_url: z.string().nullish(),
});

export type UserProfileServer = z.infer<typeof UserProfileServerSchema>;
