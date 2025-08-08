'use client';

import { MOCK_LOCATIONS } from '@/entities/location/model/mockLocation';

import { useCategories } from '@/shared/hooks/useCategories';
import Icon from '@/shared/ui/Icon';

interface Props {
	query: string;
	onSelect: (address: string, dixsplayName: string) => void;
	onCurrentLocationClick?: () => void;
}

export default function AutocompleteList({
	query,
	onSelect,
	onCurrentLocationClick,
}: Props) {
	const filtered = MOCK_LOCATIONS.filter((item) => item.name.includes(query));
	const { categories } = useCategories();
	return (
		<div className="bg-white mt-2 w-[343px] mx-auto z-10 relative">
			{/* 현재 위치 */}
			<div
				onClick={onCurrentLocationClick}
				className="flex items-center gap-2 p-3 hover:bg-gray-100 cursor-pointer "
			>
				<Icon name={'Current'} className="text-grey-50" />
				<span className="text-grey-70 text-[14px]">현재 위치로 설정</span>
			</div>
			<div className="border-t border-grey-60"></div>
			{/* 자동완성 목록 */}
			{query.trim() &&
				filtered.map((item) => {
					const localFoodItem = categories?.find((c) =>
						item.name.includes(c.name),
					);
					console.log(localFoodItem);
					const isAddress = /(?:시|읍|면|동)/.test(item.name);
					const iconName = isAddress ? 'Search' : 'Location';

					return (
						<div
							key={item.id}
							onClick={() => onSelect(item.address, item.name)}
							className="flex justify-between items-center p-3 hover:bg-gray-100 cursor-pointer"
						>
							<div className="flex items-start gap-2">
								<Icon name={iconName} className="text-grey-70 mt-[2px]" />
								<div>
									<div className="flex items-center gap-1">
										{isAddress ? (
											<>
												<p className="text-grey-80 text-[14px]">{item.name}</p>
											</>
										) : (
											<div>
												<p className="text-grey-85">{item.name}</p>
												<p className="text-[12px] text-grey-70">
													{item.address}
												</p>
											</div>
										)}
									</div>
								</div>
							</div>
							<Icon name="ArrowRight" className="text-grey-50" />
						</div>
					);
				})}
		</div>
	);
}
