import React, { createContext, useContext } from 'react';

import clsx from 'clsx';

interface SingleCategorySelectContextType {
	selectedValue: number | null;
	onChange: (value: number) => void;
}

const SingleCategorySelectContext =
	createContext<SingleCategorySelectContextType | null>(null);

interface SingleCategorySelectProps {
	value: number | null;
	onChange: (value: number) => void;
	children: React.ReactNode;
	className?: string;
}

function SingleCategorySelect({
	value,
	onChange,
	children,
	className,
}: SingleCategorySelectProps) {
	return (
		<SingleCategorySelectContext.Provider
			value={{ selectedValue: value, onChange }}
		>
			<div className={clsx('flex gap-x-[10px] gap-y-[6px]', className)}>
				{children}
			</div>
		</SingleCategorySelectContext.Provider>
	);
}

interface SingleCategorySelectItemProps {
	value: number;
	children: React.ReactNode;
	className?: string;
}

function SingleCategorySelectItem({
	value,
	children,
	className,
}: SingleCategorySelectItemProps) {
	const context = useContext(SingleCategorySelectContext);

	if (!context) {
		throw new Error(
			'SingleCategorySelect.Item must be used within SingleCategorySelect',
		);
	}

	const { selectedValue, onChange } = context;
	const isActive = selectedValue === value;

	const handleClick = () => {
		onChange(value);
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			className={clsx(
				'px-3 py-1 text-base rounded-full border transition-all border-grey-30',
				isActive ? 'bg-grey-90 text-grey-10 ' : 'text-grey-60',
				className,
			)}
		>
			{children}
		</button>
	);
}

SingleCategorySelect.Item = SingleCategorySelectItem;

export default SingleCategorySelect;
