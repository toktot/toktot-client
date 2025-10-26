import { z } from 'zod';

// GET /v1/restaurants/{restaurantId}/menus API 응답 스키마
export const MenuSchema = z.object({
  menuId: z.number(),
  menuName: z.string(),
  category: z.string(),
  price: z.number(),
  servingSize: z.number(),
  isMain: z.boolean(),
});

export const MenuListSchema = z.array(MenuSchema);

export type Menu = z.infer<typeof MenuSchema>;
