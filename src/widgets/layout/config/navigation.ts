import type { IconName } from '@/shared/icons/iconMap';

export type NavItem = {
	type: 'link';
	href: string;
	iconName: IconName;
	activeIconName?: IconName;
	label: string;
};

export type CenterActionItem = {
	type: 'action';
	href: string;
	iconName: IconName;
	'aria-label': string;
};

export const DEFAULT_NAVIGATION_ITEMS: (NavItem | CenterActionItem)[] = [
	{
		type: 'link',
		href: '/home',
		iconName: 'Home',
		activeIconName: 'HomeFill',
		label: 'home',
	},
	{
		type: 'link',
		href: '/review/view',
		iconName: 'Review',
		activeIconName: 'ReviewFill',
		label: 'review',
	},
	{
		type: 'action',
		href: '/review/write',
		iconName: 'Plus',
		'aria-label': '리뷰 작성하기',
	},
	{
		type: 'link',
		href: '/menu-upload',
		iconName: 'MenuBoard',
		activeIconName: 'MenuFill',
		label: 'menu',
	},
	{
		type: 'link',
		href: '/my',
		iconName: 'My',
		activeIconName: 'MyFill',
		label: 'my',
	},
];
