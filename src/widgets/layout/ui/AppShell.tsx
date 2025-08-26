import React from 'react';

import { BottomNav, BottomNavItem } from '@/widgets/layout';
import { DEFAULT_NAVIGATION_ITEMS } from '@/widgets/layout/config/navigation';
import { CenterButton } from '@/widgets/layout/ui/BottomNav';

interface AppShellProps {
	children: React.ReactNode;
	showBottomNav?: boolean;
}

export const AppShell = ({ children, showBottomNav = true }: AppShellProps) => {
	return (
		<div className="h-dvh min-w-[375px] flex flex-col lg:w-[480px] lg:mx-auto">
			{children}
			{showBottomNav && (
				<div className="fixed bottom-0 left-0 right-0 min-w-[375px] ">
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
				</div>
			)}
		</div>
	);
};
