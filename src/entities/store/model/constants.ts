import { IconName } from '@/shared/icons/iconMap';

interface MoodKeyWord {
	id: number;
	label: string;
	iconName?: IconName;
	iconFillColor?: string;
	activeClassName?: string;
	activeIconName?: IconName;
}

export const PLACE_MOOD_KEYWORDS: MoodKeyWord[] = [
	{ id: 1, label: '오션뷰', iconName: 'Ocean' },
	{ id: 2, label: '도시가 보이는', iconName: 'City' },
	{ id: 3, label: '산이 보이는', iconName: 'Mountain' },
	{
		id: 4,
		label: '착한가게',
		iconName: 'GoodPrice',
		activeClassName: 'bg-sub-green-10 border-sub-green-30 text-sub-green-50',
		iconFillColor: '#5ED07A',
	},
	{
		id: 5,
		label: '로컬',
		iconName: 'LocalJeju',
		activeClassName: 'bg-primary-10 border-primary-30 text-primary-50',
		activeIconName: 'FillLocalJeju',
	},
	{ id: 6, label: '한적한' },
	{ id: 7, label: '붐비는' },
	{ id: 8, label: '현지인이 많은' },
];
