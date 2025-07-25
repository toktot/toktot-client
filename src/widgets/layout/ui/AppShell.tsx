import React from 'react';

import { BottomNav, BottomNavItem, Header } from '@/widgets/layout';
import { DEFAULT_NAVIGATION_ITEMS } from '@/widgets/layout/config/navigation';
import { BOTTOM_NAV_HEIGHT, CenterButton } from '@/widgets/layout/ui/BottomNav';

interface AppShellProps {
	headerTitle: React.ReactNode;
	children: React.ReactNode;
	showBottomNav?: boolean;
}

function AppShell({
	headerTitle,
	children,
	showBottomNav = true,
}: AppShellProps) {
	const mainPaddingBottom = showBottomNav ? BOTTOM_NAV_HEIGHT : 0;

	return (
		<>
			<div className="h-dvh min-w-[375px] flex flex-col">
				<Header>
					<Header.Left />
					<Header.Center>{headerTitle}</Header.Center>
				</Header>
				<main
					className="flex-1 overflow-y-auto"
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
		</>
	);
}

export default AppShell;
