'use client';

import Icon from '@/shared/ui/Icon';
import { PlaceClient } from '../api/schema';

interface StoreSuggestionListProps {
	query: string;
	suggestions: PlaceClient[];
	onSelectSuggestion: (store: PlaceClient) => void;
	onSearchSubmit: (query: string) => void;
}

export const StoreSuggestionList = ({ 
	query,
	suggestions,
	onSelectSuggestion,
	onSearchSubmit 
}: StoreSuggestionListProps) => {
	return (
		<ul className="mt-2">
			<li
				className="p-3 cursor-pointer hover:bg-grey-10 flex items-center gap-2"
				onClick={() => onSearchSubmit(query)}
			>
				<Icon name="Search" size="xs" />
				<span className="font-semibold">{`'${query}'로 검색`}</span>
			</li>
			{suggestions.map((store) => (
				<li
					key={store.id}
					className="p-3 cursor-pointer hover:bg-grey-10 flex items-center justify-between"
					onClick={() => onSelectSuggestion(store)}
				>
					<div className=" flex items-center gap-2">
						<Icon name="Location" size="xs" />
						<div className="flex flex-col">
							<span className="font-semibold">{store.name}</span>
							<span className="text-grey-50 text-xs">{store.address}</span>
						</div>
					</div>
					<Icon name="ArrowRight" size="xs" />
				</li>
			))}
		</ul>
	);
};