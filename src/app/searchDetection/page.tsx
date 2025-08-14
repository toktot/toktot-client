'use client';

import { Suspense, useMemo, useRef, useState } from 'react';

import { mealOptions } from '@/entities/home/model/mockMealOptions';
import { trendData } from '@/entities/menuPrice/comparePrice';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import MapScreen from '@/widgets/MapScreen';

import CategorySection from '@/features/home/filter/components/CategorySection';
import PriceRangeSlider from '@/features/home/filter/components/Slider';
import { priceSummaryMap } from '@/features/home/model/mockPriceSummary';
import {
	RadiusProvider,
	useRadius,
} from '@/features/region-detection/model/RadiusContext';
import { RangeSelector } from '@/features/region-detection/ui/RangeSelector';

import {
	BottomSheet,
	BottomSheetContent,
} from '@/shared/components/BottomSheet';
import HeaderBox from '@/shared/components/HeaderBox';
import PrimaryButton from '@/shared/components/PrimaryButton';
import { useCategories } from '@/shared/hooks/useCategories';
import Icon from '@/shared/ui/Icon';
import SingleCategorySelect from '@/shared/ui/SingleCategorySelect';
import StarRating from '@/shared/ui/StarRating';

export default function LocationSearchPage() {
	const [rating, setRating] = useState(0);
	const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
	const [mealTime, setMealTime] = useState<number | null>(null);

	const handleCategoryChange = (value: number) => {
		if (selectedCategories.includes(value)) {
			setSelectedCategories(selectedCategories.filter((v) => v !== value));
		} else {
			setSelectedCategories([...selectedCategories, value]);
		}
	};

	const handleMealTimeChange = (value: number) => {
		setMealTime((prev) => (prev === value ? null : value));
	};

	return (
		<RadiusProvider>
			<Suspense fallback={<div>로딩 중...</div>}>
				<HeaderBox />
				<MapScreen />
				<LocationSearchContent
					rating={rating}
					setRating={setRating}
					selectedCategories={selectedCategories}
					handleCategoryChange={handleCategoryChange}
					mealTime={mealTime}
					handleMealTimeChange={handleMealTimeChange}
				/>
			</Suspense>
		</RadiusProvider>
	);
}

function LocationSearchContent({
	rating,
	setRating,
	selectedCategories,

	mealTime,
	handleMealTimeChange,
}: {
	rating: number;
	setRating: (v: number) => void;
	selectedCategories: number[];
	handleCategoryChange: (v: number) => void;
	mealTime: number | null;
	handleMealTimeChange: (v: number) => void;
}) {
	const [tab, setTab] = useState<
		| 'distance'
		| 'rating'
		| 'localFood'
		| 'price'
		| 'food'
		| 'service'
		| 'clean'
		| 'mood'
		| 'parking'
		| 'meal'
	>('distance');
	const [detailSelections, setDetailSelections] = useState<
		Record<string, number[]>
	>({});
	const [selectCategory, setSelectCategory] = useState<number | null>(null);
	const CategoryChange = (value: number) => {
		setSelectCategory((prev) => (prev === value ? null : value));
	};
	const { categories } = useCategories();

	const selectedCategoryName = useMemo(() => {
		return categories?.find((c) => c.id === selectCategory)?.name ?? null;
	}, [selectCategory, categories]);

	const priceSummary = useMemo(() => {
		if (!selectedCategoryName) return undefined;
		return priceSummaryMap[
			selectedCategoryName as keyof typeof priceSummaryMap
		];
	}, [selectedCategoryName]);
	const avgPrice = priceSummary?.avgPrice ?? 0;
	const icon = priceSummary?.icon ?? null;
	const searchParams = useSearchParams();
	const q = searchParams.get('q') ?? '';
	const [minPrice, setMinPrice] = useState<number | null>(null);
	const [maxPrice, setMaxPrice] = useState<number | null>(null);

	const [query, setQuery] = useState(q);
	console.log(setQuery);

	const router = useRouter();
	const { radius } = useRadius();
	const contentToRef = useRef<HTMLDivElement>(null);

	const distanceRef = useRef<HTMLDivElement>(null);
	const ratingRef = useRef<HTMLDivElement>(null);
	const localFoodRef = useRef<HTMLDivElement>(null);
	const priceRef = useRef<HTMLDivElement>(null);
	const foodRef = useRef<HTMLDivElement>(null);
	const serviceRef = useRef<HTMLDivElement>(null);
	const cleanRef = useRef<HTMLDivElement>(null);
	const moodRef = useRef<HTMLDivElement>(null);
	const parkingRef = useRef<HTMLDivElement>(null);
	const mealRef = useRef<HTMLDivElement>(null);

	const tabs = [
		{ id: 'distance', label: '거리', ref: distanceRef },
		{ id: 'rating', label: '별점', ref: ratingRef },
		{ id: 'localFood', label: '향토음식', ref: localFoodRef },
		{ id: 'price', label: '가격', ref: priceRef },
		{ id: 'food', label: '음식', ref: foodRef },
		{ id: 'service', label: '서비스', ref: serviceRef },
		{ id: 'clean', label: '청결', ref: cleanRef },
		{ id: 'mood', label: '분위기', ref: moodRef },
		{ id: 'parking', label: '주차공간', ref: parkingRef },
		{ id: 'meal', label: '시간', ref: mealRef },
	];
	const onTabClick = (tabId: string) => {
		setTab(tabId as typeof tab);
		const target = tabs.find((t) => t.id === tabId);
		if (target?.ref.current) {
			target.ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	};
	const handleConfirm = () => {
		const params = new URLSearchParams();
		if (rating) params.set('rating', rating.toString());
		if (radius) params.set('distance', radius.toString());
		console.log(radius);

		if (selectedCategories.length)
			params.set('mood', selectedCategories.join(','));
		if (mealTime !== null) params.set('mealTime', mealTime.toString());

		if (selectedCategoryName) {
			params.set('menu', selectedCategoryName);
		}
		if (minPrice !== null) params.set('minPrice', minPrice.toString());
		if (maxPrice !== null) params.set('maxPrice', maxPrice.toString());
		Object.entries(detailSelections).forEach(([category, selectedIds]) => {
			if (selectedIds.length > 0) {
				params.set(category, selectedIds.join(','));
			}
		});

		router.push(`/search?q=${query}&${params.toString()}`);
	};

	const toggleDetailSelection = (categoryId: string, optionId: number) => {
		setDetailSelections((prev) => {
			const selected = prev[categoryId] || [];
			if (selected.includes(optionId)) {
				return {
					...prev,
					[categoryId]: selected.filter((id) => id !== optionId),
				};
			} else {
				return {
					...prev,
					[categoryId]: [...selected, optionId],
				};
			}
		});
	};

	return (
		<BottomSheet open>
			<BottomSheetContent className="fixed bottom-0 left-0 right-0 z-50 bg-white max-h-[70vh] min-h-[60vh] w-[375px] p-4 overflow-y-auto">
				{/* 검색 범위 */}
				<div ref={contentToRef} />
				<div className="w-10 h-1 bg-grey-30 rounded-full mx-auto" />
				<div className="flex overflow-x-auto whitespace-nowrap border-grey-30 border-b gap-6 scrollbar-hide">
					{tabs.map(({ id, label }) => (
						<button
							key={id}
							className={clsx(
								'pb-2 mt-5 font-semibold text-[16px]',
								tab === id
									? 'text-grey-90 border-b-1 border-grey-85'
									: 'text-grey-40',
							)}
							onClick={() => onTabClick(id)}
						>
							{label}
						</button>
					))}
				</div>
				<div className="overflow-y-auto mt-4">
					<section ref={distanceRef} className="mb-10">
						<div>
							<p className="mb-2 font-semibold text-[18px] text-[#000000]">
								거리
							</p>

							<RangeSelector />
						</div>
					</section>
					<div className="w-full h-[6px] bg-grey-10 mb-5"></div>
					<section ref={ratingRef} className="mb-10">
						<div>
							<p className="font-semibold text-[18px] text-[#000000]">별점</p>
							<StarRating
								value={rating}
								onChange={setRating}
								className="gap-5 items-center ml-8 w-[343px] h-[51px]"
								iconSize="xxl"
							/>
							<div className="mt-3 text-[20px] text-[#000000] font-semibold text-center">
								{`${rating}`}점 이상
							</div>
						</div>
					</section>
					<div className="w-full h-[6px] bg-grey-10 mb-5"></div>
					<section ref={localFoodRef} className="mb-10">
						<>
							<div>
								<p className="mb-2 font-semibold text-[18px] text-[#000000]">
									향토 음식
								</p>
								<SingleCategorySelect
									value={selectCategory}
									onChange={CategoryChange}
								>
									<div className="flex flex-wrap gap-2 mt-2">
										{categories?.map((keyword) => {
											const isActive = selectCategory === keyword.id;

											return (
												<SingleCategorySelect.Item
													key={keyword.id}
													value={keyword.id || 0}
													className={clsx(
														`flex items-center gap-1`,
														isActive
															? 'bg-primary-10 border-primary-30 text-primary-50'
															: 'border-grey-60 text-grey-60',
														'border px-3 py-1 rounded-full text-sm font-medium select-none',
													)}
												>
													{keyword.icon && (
														<Icon name={keyword.icon} className="w-4 h-4" />
													)}
													{keyword.name}
												</SingleCategorySelect.Item>
											);
										})}
									</div>
								</SingleCategorySelect>
							</div>
							<div className="w-full h-[3px] bg-grey-10 mt-5"></div>
							{priceSummary ? (
								<div className="mt-4">
									<div className="mb-2">
										<span className="inline-flex items-center justify-center px-3 h-6 rounded-full bg-primary-10 text-primary-50 text-sm mr-1">
											{selectedCategoryName}
										</span>
										<span className="text-[18px] font-semibold text-[#000000]">
											의 가격
										</span>
									</div>
									<div className="flex items-center gap-1 rounded-2xl bg-primary-10 h-9">
										{icon && <Icon name={icon} className="ml-2" />}
										{selectedCategoryName}
										<span className="text-grey-70 text-sm"> 1인 평균</span>
										<span className="text-grey-90 text-[18px]">
											{avgPrice !== null && avgPrice > 0
												? avgPrice
												: '정보 없음'}
										</span>
										<span className="text-grey-70 text-sm">원</span>
										{trendData
											.filter((item) => item.menuName === selectedCategoryName)
											.map((item, index) => (
												<span
													key={index}
													className="ml-4 text-sm flex items-center gap-1"
												>
													<span className="text-grey-70 ml-10 text-[9px]">
														{item.text}
													</span>
													<span
														className={
															item.isIncrease
																? 'text-green-500 text-[9px]'
																: 'text-red-500 text-[9px]'
														}
													>
														{item.priceChange}
													</span>
												</span>
											))}
									</div>

									{avgPrice !== null && avgPrice > 0 && (
										<PriceRangeSlider
											min={priceSummary.minPrice}
											avg={priceSummary.avgPrice}
											max={priceSummary.maxPrice}
											onChange={(min, max) => {
												setMinPrice(min);
												setMaxPrice(max);
											}}
										/>
									)}
								</div>
							) : (
								<div className="mt-4 text-grey-60 text-sm">
									가격 정보가 없습니다.
								</div>
							)}
						</>
					</section>
					<div className="w-full h-[6px] bg-grey-10 mb-5"></div>
					<section ref={priceRef} className="mb-10">
						<CategorySection
							categoryId="price"
							detailSelections={detailSelections}
							toggleDetailSelection={toggleDetailSelection}
						/>
					</section>
					<div className="w-full h-[3px] bg-grey-10 mb-5"></div>
					<section ref={foodRef} className="mb-10">
						<CategorySection
							categoryId="food"
							detailSelections={detailSelections}
							toggleDetailSelection={toggleDetailSelection}
						/>
					</section>
					<div className="w-full h-[3px] bg-grey-10 mb-5"></div>
					<section ref={serviceRef} className="mb-10">
						<CategorySection
							categoryId="service"
							detailSelections={detailSelections}
							toggleDetailSelection={toggleDetailSelection}
						/>
					</section>
					<div className="w-full h-[3px] bg-grey-10 mb-5"></div>
					<section ref={cleanRef} className="mb-10">
						<CategorySection
							categoryId="clean"
							detailSelections={detailSelections}
							toggleDetailSelection={toggleDetailSelection}
						/>
					</section>
					<div className="w-full h-[3px] bg-grey-10 mb-5"></div>
					<section ref={moodRef} className="mb-10">
						<CategorySection
							categoryId="mood"
							detailSelections={detailSelections}
							toggleDetailSelection={toggleDetailSelection}
						/>
					</section>
					<div className="w-full h-[3px] bg-grey-10 mb-5"></div>
					<section ref={parkingRef} className="mb-10">
						<CategorySection
							categoryId="parking"
							detailSelections={detailSelections}
							toggleDetailSelection={toggleDetailSelection}
						/>
					</section>
					<div className="w-full h-[6px] bg-grey-10 mb-5"></div>
					<section ref={mealRef} className="mb-10">
						<div>
							<p className="mb-3 font-semibold text-[18px] text-[#000000]">
								식사시간
							</p>
							<div className="flex gap-2">
								{mealOptions.map(({ label, value, iconName }) => {
									return (
										<button
											key={value}
											className={`w-[108px] h-[110px] flex flex-col items-center justify-center px-3 py-1 rounded-[20px] border transition-all ${mealTime === value ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 text-gray-600'}`}
											onClick={() => handleMealTimeChange(value)}
										>
											<Icon
												name={iconName}
												className="mb-1 items-center"
												size="xxl"
											/>
											<span className="text-sm">{label}</span>
										</button>
									);
								})}
							</div>
						</div>
						<div className="fixed bottom-0 left-0 right-0 flex flex-col items-center mr-17">
							<PrimaryButton
								text="완료"
								className="w-[343px]"
								bgColorWhenEnabled="bg-grey-90"
								textColorWhenEnabled="text-primary-40"
								onClick={handleConfirm}
							/>

							<div className="w-16 h-[0.9px] bg-[#000000] rounded-full mx-auto mt-3 bottom-3 z-50" />
						</div>
					</section>
				</div>

				{/* 지도 */}
			</BottomSheetContent>
		</BottomSheet>
	);
}
