import { ReactNode } from 'react';

import { Direction, tailDirectionClassMap } from '../model/direction';

interface BubbleProps {
	direction: Direction;
	children: ReactNode;
}

export const Bubble = ({ direction, children }: BubbleProps) => {
	return (
		<div className="bg-white px-[15px] py-[6px] overflow-hidden rounded-[20px] shadow-md ">
			{children}
			<div className={`${tailDirectionClassMap[direction]}`} />
		</div>
	);
};
