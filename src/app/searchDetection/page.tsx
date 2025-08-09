'use client';

import { Suspense, useMemo, useState } from 'react';

import { detailCategories } from '@/entities/cataegory/detailCategories';
import { mealOptions } from '@/entities/home/model/mockMealOptions';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import MapScreen from '@/widgets/MapScreen';

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
import MultiCategorySelect from '@/shared/ui/MultiCategorySelect';
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
		'distance' | 'rating' | 'localFood' | 'price' | 'mood' | 'meal'
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
			<BottomSheetContent className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-4 max-h-[90vh] overflow-y-auto">
				{/* 검색 범위 */}
				<div className="flex gap-6 mt-10 border-b border-gray-100">
					<button
						className={`pb-2 text-base font-semibold ${tab === 'distance' ? 'text-grey-90 border-b-1 border-[#333C4A]' : 'text-grey-40'}`}
						onClick={() => setTab('distance')}
					>
						거리
					</button>
					<button
						className={`pb-2 text-base font-semibold ${tab === 'rating' ? 'text-grey-90 border-b-1 border-[#333C4A]' : 'text-grey-40'}`}
						onClick={() => setTab('rating')}
					>
						별점
					</button>
					<button
						className={`pb-2 text-base font-semibold ${tab === 'localFood' ? 'text-grey-90 border-b-1 border-[#333C4A]' : 'text-grey-40'}`}
						onClick={() => setTab('localFood')}
					>
						향토음식
					</button>
					<button
						className={`pb-2 text-base font-semibold ${tab === 'mood' ? 'text-grey-90 border-b-1 border-[#333C4A]' : 'text-grey-40'}`}
						onClick={() => setTab('mood')}
					>
						세부
					</button>
					<button
						className={`pb-2 text-base font-semibold ${tab === 'meal' ? 'text-grey-90 border-b-1 border-[#333C4A]' : 'text-grey-40'}`}
						onClick={() => setTab('meal')}
					>
						시간
					</button>
				</div>
				{tab === 'distance' && (
					<div className="mt-5">
						<p className="mb-3 w-[31px] h-[25px] text-[#000000]">거리</p>

						<RangeSelector />
					</div>
				)}
				{tab === 'rating' && (
					<div>
						<p className="mb-3 mt-5 w-[31px] h-[25px] text-[#000000]">별점</p>
						<StarRating
							value={rating}
							onChange={setRating}
							className="gap-10 ml-4"
						/>
						<div className="mt-4 text-xl text-grey-90 text-center">
							{`${rating}`}점 이상
						</div>
					</div>
				)}
				{tab === 'localFood' && (
					<>
						<div>
							<p className="mb-3 mt-3 w-[80px] h-[25px] text-[#000000]">
								향토 음식
							</p>
							<SingleCategorySelect
								value={selectCategory}
								onChange={CategoryChange}
							>
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
							</SingleCategorySelect>
						</div>

						{priceSummary ? (
							<div className="mt-4">
								<span className="w-[50px] h-[20px] bg-primary-10 text-primary-40 text-sm mr-3">
									{selectedCategoryName}
								</span>
								의 가격
								<div className="flex items-center gap-1 rounded-md bg-primary-20 h-10">
									{icon && <Icon name={icon} />}
									{selectedCategoryName}
									<span className="text-grey-70 text-sm"> 1인 평균</span>
									<span className="text-grey-90 text-[18px]">
										{avgPrice !== null && avgPrice > 0 ? avgPrice : '정보 없음'}
									</span>
									<span className="text-grey-70 text-sm">원</span>
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
				)}

				{tab === 'mood' && (
					<div>
						<div className="mb-3 mt-3 w-[80px] h-[25px]text-[#000000]">
							{detailCategories.map((category) => (
								<div key={category.id} className="mb-4">
									<div className="mb-2 font-semibold text-[#000]">
										{category.label}
									</div>
									<MultiCategorySelect
										value={detailSelections[category.id] || []}
										onChange={(optionId: number) =>
											toggleDetailSelection(category.id, optionId)
										}
									>
										{category.options.map((option) => {
											const isActive = (
												detailSelections[category.id] || []
											).includes(option.id);
											return (
												<MultiCategorySelect.Item
													key={option.id}
													value={option.id}
													className={clsx(
														'border px-3 py-1 rounded-full text-sm font-medium select-none',
														isActive
															? 'bg-blue-100 border-blue-300 text-blue-600'
															: 'border-grey-60 text-grey-60',
													)}
												>
													<span>{option.label}</span>
												</MultiCategorySelect.Item>
											);
										})}
									</MultiCategorySelect>
								</div>
							))}
						</div>
					</div>
				)}
				{tab === 'meal' && (
					<div>
						<p className="mb-3 mt-3 w-[80px] h-[25px] text-[#000000]">
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
				)}

				<PrimaryButton
					text="위치 설정"
					className="w-full mt-4"
					bgColorWhenEnabled="bg-grey-90"
					textColorWhenEnabled="text-primary-40"
					onClick={handleConfirm}
				/>

				{/* 지도 */}
			</BottomSheetContent>
		</BottomSheet>
	);
}
