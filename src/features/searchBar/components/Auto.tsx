import { mockSearchList } from '@/entities/home/model/mockSearchList';

import { CategoryItem } from '@/features/home/components/FoodIcon';

import { useCategories } from '@/shared/hooks/useCategories';
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
	const { categories } = useCategories();
	const filteredCategories: CategoryItem[] =
		categories?.filter((item) => item.name.includes(query)) || [];

	if (!query.trim()) return null;
	return (
		<div className="bg-white min-w-[343px] max-w-[430px] w-full mx-auto flex-start z-10 relative mt-2">
			{filteredCategories.map((item) => (
				<div
					key={item.id}
					onClick={() => onSelect(item.name)}
					className="flex justify-between items-center py-2 -ml-1"
				>
					<div className="flex items-center gap-3">
						<div className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm">
							<Icon name={item.icon} />
						</div>
						<p className="text-sm">{highlightMatch(item.name, query)}</p>
						<span className="text-[12px] text-grey-80 mt-0.5">향토음식</span>
					</div>
					<Icon name="ArrowRight" className="text-grey-50 " size="xxs" />
				</div>
			))}
			{filtered.map((item) => (
				<div
					key={item.id}
					onClick={() => onSelect(item.name)}
					className="flex justify-between items-center py-2 hover:bg-grey-30 cursor-pointer"
				>
					<div className="flex items-center gap-1">
						<Icon name={'Search'} className="text-grey-70" size="xs" />
						<p className="text-sm ml-2">{highlightMatch(item.name, query)}</p>
					</div>

					<Icon name={'ArrowRight'} className="text-grey-50 " size="xxs" />
				</div>
			))}
		</div>
	);
}
