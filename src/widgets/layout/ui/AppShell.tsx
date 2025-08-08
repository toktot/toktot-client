import React from 'react';

import { BottomNav, BottomNavItem } from '@/widgets/layout';
import { DEFAULT_NAVIGATION_ITEMS } from '@/widgets/layout/config/navigation';
import { BOTTOM_NAV_HEIGHT, CenterButton } from '@/widgets/layout/ui/BottomNav';

interface AppShellProps {
	children: React.ReactNode;
	showBottomNav?: boolean;
}

export const AppShell = ({ children, showBottomNav = true }: AppShellProps) => {
	const mainPaddingBottom = showBottomNav ? BOTTOM_NAV_HEIGHT : 0;

	return (
		<div className="h-dvh min-w-[375px] flex flex-col">
			<main
				className="flex-1 h-full"
				style={{ paddingBottom: mainPaddingBottom }}
			>
				{children}
			</main>
			{showBottomNav && (
				<BottomNav>
					{DEFAULT_NAVIGATION_ITEMS.map((item) => {
						if (item.type === 'action') {
							return (
								<CenterButton
									key={item.href}
									href={item.href}
									iconName={item.iconName}
									aria-label={item['aria-label']}
								/>
							);
						}

						return (
							<BottomNavItem
								key={item.href}
								href={item.href}
								iconName={item.iconName}
								label={item.label}
							/>
						);
					})}
				</BottomNav>
			)}
		</div>
	);
};
