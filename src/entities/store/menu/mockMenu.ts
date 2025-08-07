export interface Menu {
	id: string;
	imageUrl: string;
	menuName: string;
	peopleNumber: string;
	price: number;
	type: string;
}

export const mockMenu: Menu[] = [
	{
		id: '1',
		imageUrl: '/images/menuPrice1.png',
		menuName: '돔베고기',
		peopleNumber: '2인분',
		price: 25000,
		type: '주메뉴',
	},
	{
		id: '2',
		imageUrl: '/images/menuPrice2.png',
		menuName: '고기국수',
		peopleNumber: '2인분',
		price: 25000,
		type: '국',
	},
];
