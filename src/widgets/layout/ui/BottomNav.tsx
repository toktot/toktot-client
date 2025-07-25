'use client';

import type { ReactNode } from 'react';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { IconName } from '@/shared/icons/iconMap';
import Icon from '@/shared/ui/Icon';

interface ItemProps {
	href: string;
	iconName: IconName;
	label: string;
}

export const BottomNavItem = ({ href, iconName, label }: ItemProps) => {
	const pathname = usePathname();
	// 현재 경로가 이 아이템의 href로 시작하는지 확인하여 활성화 상태를 결정합니다.
	//  (예: 현재 경로가 /review/write일 때, href가 /review인 아이템도 active로 처리)
	const isActive = pathname.startsWith(href);

	return (
		<Link
			href={href}
			className="flex flex-col items-center justify-center text-center gap-1"
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

export const BOTTOM_NAV_HEIGHT = 48;

export const BottomNav = ({ children }: BottomNavProps) => {
	return (
		<nav
			className="fixed bottom-0 left-0 right-0 bg-white shadow-top z-10"
			style={{ height: BOTTOM_NAV_HEIGHT }}
		>
			<div className="grid grid-cols-5 h-full mx-auto">{children}</div>
		</nav>
	);
};
