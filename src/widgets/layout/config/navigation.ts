import type { IconName } from '@/shared/icons/iconMap';

export type NavItem = {
	type: 'link';
	href: string;
	iconName: IconName;
	label: string;
};

export type CenterActionItem = {
	type: 'action';
	href: string;
	iconName: IconName;
	'aria-label': string;
};

export const DEFAULT_NAVIGATION_ITEMS: (NavItem | CenterActionItem)[] = [
	{ type: 'link', href: '/home', iconName: 'Home', label: 'home' },
	{ type: 'link', href: '/review/view', iconName: 'Review', label: 'review' },
	{
		type: 'action',
		href: '/review/write/1',
		iconName: 'ReviewPlus',
		'aria-label': '리뷰 작성하기',
	},
	{
		type: 'link',
		href: '/menu-upload',
		iconName: 'Route',
		label: 'menu',
	},
	{ type: 'link', href: '/my', iconName: 'My', label: 'my' },
];
