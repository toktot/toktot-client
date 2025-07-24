import type { ReactNode } from 'react';

import { BackButton } from '@/features/navigation/back/ui/BackButton';

/**
 *
 *  children이 존재하면(외부에서 주입되면), 그 children을 렌더링합니다.
 *  children이 존재하지 않으면(undefined), 기본값인 <BackButton />을 렌더링합니다.
 */

const Left = ({ children }: { children?: ReactNode }) => (
	<div className="flex-shrink-0">
		{children !== undefined ? children : <BackButton />}
	</div>
);
const Center = ({ children }: { children: ReactNode }) => (
	<div className="absolute left-1/2 -translate-x-1/2 font-semibold">
		{children}
	</div>
);
const Right = ({ children }: { children: ReactNode }) => (
	<div className="flex-shrink-0">{children}</div>
);

interface HeaderProps {
	children: ReactNode;
}

export const Header = ({ children }: HeaderProps) => {
	return (
		<header className="relative flex items-center justify-between h-16 px-4">
			{children}
		</header>
	);
};

Header.Left = Left;
Header.Center = Center;
Header.Right = Right;
