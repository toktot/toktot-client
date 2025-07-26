export interface MenuItemData {
	id: string;
	name: string;
	price: number;
	imageUrl?: string;
}

// 리뷰 컨텍스트에서 사용될 확장된 메뉴 타입
// (이 타입은 menu 엔티티가 소유하지만, review 컨텍스트를 위해 존재)
export interface ReviewedMenuItemData extends MenuItemData {
	rating: number;
	servings?: number;
}
