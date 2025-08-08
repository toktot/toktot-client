import type { IconName } from '@/shared/icons/iconMap';

interface MoodKeywordStyle {
	iconName: IconName;
	activeIconName?: IconName;
	activeClassName?: string;
	iconFillColor?: string;
}

export const MOOD_KEYWORD_STYLE_MAP: Record<string, MoodKeywordStyle> = {
	1: { iconName: 'Ocean' },
	2: { iconName: 'City' },
	3: { iconName: 'Mountain' },
	4: {
		iconName: 'GoodPrice',
		activeClassName: 'bg-sub-green-10 border-sub-green-30 text-sub-green-50',
		iconFillColor: '#5ED07A',
	},
	5: {
		iconName: 'LocalJeju',
		activeIconName: 'FillLocalJeju',
		activeClassName: 'bg-primary-10 border-primary-30 text-primary-50',
	},
};
