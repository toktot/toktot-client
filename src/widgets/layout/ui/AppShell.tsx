import React from 'react';

import { BottomNav, BottomNavItem } from '@/widgets/layout';
import { DEFAULT_NAVIGATION_ITEMS } from '@/widgets/layout/config/navigation';
import { CenterButton } from '@/widgets/layout/ui/BottomNav';

import { BOTTOM_NAV_HEIGHT } from '../config/height';

interface AppShellProps {
	children: React.ReactNode;
	showBottomNav?: boolean;
}

export const AppShell = ({ children, showBottomNav = true }: AppShellProps) => {
	return (
		<div className="h-dvh min-w-[375px] flex flex-col lg:w-[480px] lg:mx-auto">
			<div
				className="flex-1 flex flex-col overflow-y-auto"
				style={{
					minHeight: `calc(100vh${showBottomNav ? ` - ${BOTTOM_NAV_HEIGHT}px` : ''})`,
					paddingBottom: showBottomNav ? `${BOTTOM_NAV_HEIGHT}px` : 0,
				}}
			>
				{children}
			</div>
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
								activeIconName={item.activeIconName}
								label={item.label}
							/>
						);
					})}
				</BottomNav>
			)}
		</div>
	);
};
