export interface MenuItem {
	id: string;
	name: string;
	price: number;

	servings?: number; // 인분
	imageUrl?: string;
}
