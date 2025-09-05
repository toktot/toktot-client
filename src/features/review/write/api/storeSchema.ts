import { z } from 'zod';

import { StoreId } from '@/shared/model/types';

// GET /v1/restaurants/{id} 의 응답 data 스키마
export const StoreServerSchema = z.object({
	id: z.number(),
	name: z.string(),
	address: z.string(),
	is_local_store: z.boolean().nullable(),
	value_for_money_score: z.number().nullable(),
	point: z.number().nullable(),
	business_hours: z.string().nullable(),
	phone: z.string().nullable(),
	image: z.string().nullable(),
	latitude: z.number(),
	longitude: z.number(),
});

export const StoreClientSchema = StoreServerSchema.transform((serverData) => ({
	id: String(serverData.id) as StoreId,
	storeName: serverData.name,
	address: serverData.address,
	storeImageUrl: serverData.image,
	mainMenu: '메뉴 등록이 필요해요.',
}));

export type Store = z.infer<typeof StoreClientSchema>;
