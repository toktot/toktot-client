import { mockSearchList } from '@/entities/home/model/mockSearchList';

import { CategoryItem, categories } from '@/features/home/components/FoodIcon';

import Icon from '@/shared/ui/Icon';

interface Props {
	query: string;
	onSelect: (name: string) => void;
}

function highlightMatch(text: string, query: string) {
	const idx = text.indexOf(query);
	if (idx === -1 || !query) return <span>{text}</span>;
	const prefix = text.slice(0, idx);
	const match = text.slice(idx, idx + query.length);
	const suffix = text.slice(idx + query.length);

	return (
		<>
			<span className="text-grey-90">{prefix}</span>
			<span className="text-primary-40">{match}</span>
			<span className="text-grey-90">{suffix}</span>
		</>
	);
}

export default function Auto({ query, onSelect }: Props) {
	const filtered = mockSearchList.filter((item) => item.name.includes(query));
	const filteredCategories: CategoryItem[] = categories.filter((item) =>
		item.name.includes(query),
	);

	if (!query.trim()) return null;
	return (
		<div className="bg-white w-[343px] mx-auto z-10 relative">
			{filteredCategories.map((item) => (
				<div
					key={item.id}
					onClick={() => onSelect(item.name)}
					className="flex justify-between items-center p-3"
				>
					<div className="flex items-center gap-3">
						<div className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm">
							<Icon name={item.icon} />
						</div>
						<p className="text-sm">{highlightMatch(item.name, query)}</p>
					</div>
					<Icon name="ArrowRight" />
				</div>
			))}
			{filtered.map((item) => (
				<div
					key={item.id}
					onClick={() => onSelect(item.name)}
					className="flex justify-between items-center p-3 hover:bg-grey-30 cursor-pointer"
				>
					<p className="text-sm">{highlightMatch(item.name, query)}</p>

					<Icon name={'ArrowRight'} />
				</div>
			))}
		</div>
	);
}
