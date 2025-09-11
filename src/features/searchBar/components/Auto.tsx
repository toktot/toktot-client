import { useEffect, useState } from 'react';

import { CategoryItem } from '@/features/home/components/FoodIcon';

import { useCategories } from '@/shared/hooks/useCategories';
import Icon from '@/shared/ui/Icon';

interface Props {
	query: string;
	onSelect: (name: string) => void;
}

interface KakaoPlace {
	id: string;
	place_name: string;
	address_name: string;
	category_group_code?: 'FD6' | 'CE7';
	x: string;
	y: string;
}
const JEJU_POLYGON: [number, number][] = [
	[126.1453, 33.1908], // SW
	[126.9722, 33.1908], // SE
	[126.9722, 33.5639], // NE
	[126.1453, 33.5639], // NW
];

function isInsidePolygon(x: number, y: number, polygon: [number, number][]) {
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const [xi, yi] = polygon[i];
		const [xj, yj] = polygon[j];
		const intersect =
			yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
		if (intersect) inside = !inside;
	}
	return inside;
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
	const { categories } = useCategories();
	const filteredCategories: CategoryItem[] =
		categories?.filter((item) => item.name.includes(query)) || [];

	const [places, setPlaces] = useState<KakaoPlace[]>([]);
	useEffect(() => {
		if (!query.trim()) {
			setPlaces([]);
			return;
		}

		const fetchPlaces = async () => {
			const searchQuery = `제주 ${query}`;
			try {
				const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(
					searchQuery,
				)}&size=15`;

				const res = await fetch(url, {
					headers: {
						Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
					},
				});
				if (!res.ok) throw new Error('HTTP error!');

				const data = await res.json();
				const filtered: KakaoPlace[] = (data.documents || []).filter(
					(place: KakaoPlace) =>
						['FD6', 'CE7'].includes(place.category_group_code || ''),
				);
				const resultfiltered = filtered.filter((place) =>
					isInsidePolygon(
						parseFloat(place.x),
						parseFloat(place.y),
						JEJU_POLYGON,
					),
				);
				setPlaces(resultfiltered);
			} catch (error) {
				console.error(error);
			}
		};
		fetchPlaces();
	}, [query]);

	if (!query.trim()) return null;

	return (
		<div className="absolute -ml-1 bg-white min-w-[343px] max-w-[430px] mx-auto z-50 mt-2">
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
			{places.map((place) => (
				<div
					key={place.id}
					onClick={() => onSelect(place.place_name)}
					className="flex justify-between items-center py-2 hover:bg-grey-30 cursor-pointer"
				>
					<div className="flex items-center gap-1">
						<Icon name={'Search'} className="text-grey-70" size="xs" />
						<p className="text-sm ml-2">
							{highlightMatch(place.place_name, query)}
						</p>
					</div>

					<Icon name={'ArrowRight'} className="text-grey-50 " size="xxs" />
				</div>
			))}
		</div>
	);
}
