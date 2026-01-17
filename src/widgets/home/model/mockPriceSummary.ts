import { PriceSummaryProps } from '../ui/PriceSummary';

// ✅ object 형태로 정의
export const priceSummaryMap: Record<string, PriceSummaryProps> = {
	갈치구이: {
		id: 1,
		icon: 'Galchi',
		MenuName: '갈치구이',
		avgPrice: 52000,
		minPrice: 34000,
		maxPrice: 72000,
		minRate: 10,
		maxRate: 20,
	},
	돔베고기: {
		id: 2,
		icon: 'DombeGogi',
		MenuName: '돔베고기',
		avgPrice: 52000,
		minPrice: 34000,
		maxPrice: 72000,
		minRate: 5,
		maxRate: 20,
	},
	// 추가 항목들...
};
