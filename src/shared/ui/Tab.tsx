'use client';

import clsx from 'clsx';

export interface TabItem<T extends string> {
	id: T;
	label: string;
}

interface TabProps<T extends string> {
	tabs: TabItem<T>[];
	activeTab: T;
	onTabChange: (tabId: T) => void;
	className?: string;
}

const Tab = <T extends string>({
	tabs,
	activeTab,
	onTabChange,
	className,
}: TabProps<T>) => {
	const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTab);

	return (
		<div className={clsx('relative border-b border-grey-20', className)}>
			<div className="flex items-center justify-around">
				{tabs.map((tab) => {
					const isActive = tab.id === activeTab;
					return (
						<button
							key={tab.id}
							onClick={() => onTabChange(tab.id)}
							className={clsx(
								'flex-1 py-3 text-center font-semibold transition-colors',
								isActive ? 'text-grey-90' : 'text-grey-70 hover:text-grey-80',
							)}
							role="tab"
							aria-selected={isActive}
						>
							{tab.label}
						</button>
					);
				})}
			</div>
			{activeTabIndex > -1 && (
				<div
					className="absolute bottom-[-1px] h-[2px] bg-grey-900 transition-all duration-300 ease-in-out border-b border-grey-90"
					style={{
						width: `${100 / tabs.length}%`,
						left: `${(activeTabIndex * 100) / tabs.length}%`,
					}}
				/>
			)}
		</div>
	);
};

export default Tab;
