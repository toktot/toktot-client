// 메뉴 ID별 날짜별 가격 변동 데이터
export const mockGraphByMenuId: Record<
	string,
	{ day: string; price: number }[]
> = {
	'1': [
		{ day: '2', price: 12000 },
		{ day: '3', price: 24000 },
		{ day: '4', price: 25000 },
		{ day: '5', price: 25000 },
		{ day: '6', price: 25000 },
	],
	'2': [
		{ day: '2', price: 21000 },
		{ day: '3', price: 22000 },
		{ day: '4', price: 25000 },
		{ day: '5', price: 25000 },
		{ day: '6', price: 25000 },
	],
};
