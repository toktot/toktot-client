'use client';

import type { ReactNode } from 'react';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { IconName } from '@/shared/icons/iconMap';
import Icon from '@/shared/ui/Icon';

import { BOTTOM_NAV_HEIGHT } from '../config/height';

interface ItemProps {
	href: string;
	iconName: IconName;
	label: string;
	foreActive?: boolean;
}

export const BottomNavItem = ({
	href,
	iconName,
	label,
	foreActive,
}: ItemProps) => {
	const pathname = usePathname();
	// 현재 경로가 이 아이템의 href로 시작하는지 확인하여 활성화 상태를 결정합니다.
	//  (예: 현재 경로가 /review/write일 때, href가 /review인 아이템도 active로 처리)
	const isActive =
		foreActive ||
		pathname.startsWith(href) ||
		(href === '/home' && pathname.startsWith('/search'));
	return (
		<Link
			href={href}
			className="flex flex-col items-center justify-center text-center"
		>
			<Icon
				name={iconName}
				className={clsx(isActive ? 'text-primary-50' : 'text-grey-70')}
			/>
			<span
				className={clsx(
					'text-xs font-medium',
					isActive ? 'text-primary-50' : 'text-grey-70',
				)}
			>
				{label}
			</span>
		</Link>
	);
};

interface CenterButtonProps {
	href: string;
	iconName: IconName;
	'aria-label': string;
}

export const CenterButton = ({
	href,
	iconName,
	'aria-label': ariaLabel,
}: CenterButtonProps) => {
	return (
		<div className="relative flex justify-center">
			<Link
				href={href}
				aria-label={ariaLabel}
				className={clsx(
					'w-10 h-10 bg-grey-90 rounded-3xl flex items-center justify-center text-primary-50',
				)}
			>
				<Icon name={iconName} />
			</Link>
		</div>
	);
};

interface BottomNavProps {
	children: ReactNode;
}

export const BottomNav = ({ children }: BottomNavProps) => {
	return (
		<nav
			className="bg-white shadow-top z-10 fixed bottom-0 left-0 right-0 w-full"
			style={{ height: BOTTOM_NAV_HEIGHT }}
		>
			<div className="flex items-center justify-around h-full mx-auto">
				{children}
			</div>
		</nav>
	);
};
