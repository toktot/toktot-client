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
		href: '/review/write',
		iconName: 'ReviewPlus',
		'aria-label': '리뷰 작성하기',
	},
	{ type: 'link', href: '/route', iconName: 'Route', label: 'route' },
	{ type: 'link', href: '/my-page', iconName: 'My', label: 'my' },
];
