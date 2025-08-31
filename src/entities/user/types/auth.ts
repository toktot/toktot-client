export interface User {
	id: number;
	username: string;
	password: string;
	nickname: string;
	gasimbi?: number;
	profileImageUrl?: string;
	reviewCount?: number;
	averageRating?: number;
}
