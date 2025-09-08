import { z } from 'zod';

import { StoreId } from '@/shared/model/types';

// GET /v1/restaurants/{id} 의 응답 data 스키마
export const StoreServerSchema = z.object({
	id: z.number(),
	name: z.string(),
	address: z.string(),
	latitude: z.number(),
	longitude: z.number(),

	is_local_store: z.boolean().nullish(),
	value_for_money_score: z.number().nullish(),
	point: z.number().nullish(),
	business_hours: z.string().nullish(),
	phone: z.string().nullish(),
	image: z.string().nullish(),
});

export const StoreClientSchema = StoreServerSchema.transform((serverData) => ({
	id: String(serverData.id) as StoreId,
	storeName: serverData.name,
	address: serverData.address,
	storeImageUrl: serverData.image,
	mainMenu: '메뉴 등록이 필요해요.',
	latitude: serverData.latitude,
	longitude: serverData.longitude,
}));

export type Store = z.infer<typeof StoreClientSchema>;
