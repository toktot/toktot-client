'use client';

import clsx from 'clsx';

interface FilterItem {
	id: string;
	label: string;
	active: boolean;
}

interface ReviewFeedFilterProps {
	filters: FilterItem[];
	onFilterClick: (id: string) => void;
}

export const ReviewFeedFilter = ({
	filters,
	onFilterClick,
}: ReviewFeedFilterProps) => {
	return (
		<div className="w-full overflow-x-auto scrollbar-hide pr-10">
			<div className="flex flex-nowrap items-center gap-2">
				{filters.map((filter) => (
					<button
						key={filter.id}
						onClick={() => onFilterClick(filter.id)}
						className={clsx(
							'shrink-0 px-3 py-1 rounded-full text-sm',
							filter.active
								? 'border border-[#38DEFF33] text-primary-40'
								: 'bg-grey-90  text-grey-60',
						)}
					>
						{filter.label}
					</button>
				))}
			</div>
		</div>
	);
};
