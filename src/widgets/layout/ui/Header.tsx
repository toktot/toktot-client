import type { ReactNode } from 'react';

import clsx from 'clsx';

interface HeaderPartProps {
	children: ReactNode;
}

const Left = ({ children }: HeaderPartProps) => (
	<div className="flex-shrink-0">{children}</div>
);
const Center = ({ children }: HeaderPartProps) => (
	<div className="flex-1 flex justify-center font-semibold">{children}</div>
);
const Right = ({ children }: HeaderPartProps) => (
	<div className="flex-shrink-0">{children}</div>
);

interface HeaderProps {
	children: ReactNode;
	className?: string;
}

export const Header = ({ children, className }: HeaderProps) => {
	return (
		<header
			className={clsx(
				'relative flex items-center justify-between h-12 px-4',
				className,
			)}
		>
			{children}
		</header>
	);
};

Header.Left = Left;
Header.Center = Center;
Header.Right = Right;
