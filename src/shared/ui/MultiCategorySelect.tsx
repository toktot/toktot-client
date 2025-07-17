import React, { createContext, useContext } from 'react';

import clsx from 'clsx';

type OnChange = (value: number) => void;

type MultiCategorySelectContextType = {
	value: number[];
	onChange: OnChange;
};

const MultiCategorySelectContext =
	createContext<MultiCategorySelectContextType>({
		value: [],
		onChange: () => {},
	});

interface Props {
	value: number[];
	onChange: OnChange;
	children: React.ReactNode;
	className?: string;
}

function MultiCategorySelect({ value, onChange, children, className }: Props) {
	return (
		<MultiCategorySelectContext.Provider value={{ value, onChange }}>
			<div
				className={clsx('flex flex-wrap gap-x-[10px] gap-y-[6px]', className)}
			>
				{children}
			</div>
		</MultiCategorySelectContext.Provider>
	);
}

interface ItemProps {
	children: React.ReactNode;
	value: number;
	className?: string;
}

function Item({ children, value, className }: ItemProps) {
	const context = useContext(MultiCategorySelectContext);

	const isActive = context.value.includes(value);

	return (
		<button
			className={clsx(
				'px-3 py-1 text-base rounded-full border transition-all border-grey-30',
				isActive ? 'bg-grey-90 text-grey-10 ' : 'text-grey-60',
				className,
			)}
			onClick={() => context.onChange(value)}
		>
			{children}
		</button>
	);
}

MultiCategorySelect.Item = Item;

export default MultiCategorySelect;
