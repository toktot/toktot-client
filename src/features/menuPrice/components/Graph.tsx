'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { mockGraph } from '@/entities/menuPrice/mockGraph';
import { mockStores } from '@/entities/store/model/mockStore';
import { useSearchParams } from 'next/navigation';
import {
	Bar,
	BarChart,
	CartesianGrid,
	Line,
	ResponsiveContainer,
	Scatter,
	ScatterChart,
	XAxis,
	YAxis,
} from 'recharts';
import { ScatterPointItem } from 'recharts/types/cartesian/Scatter';

import { priceSummaryMap } from '@/features/home/model/mockPriceSummary';

import StoreInfoCard from '@/shared/components/StoreCard';
import { useCategories } from '@/shared/hooks/useCategories';
import Icon from '@/shared/ui/Icon';

export type GraphPoint = { price: number; store: number };
type ClickedPoint = {
	price: number;
	store: number;
	cx: number;
	cy: number;
} | null;
type CustomTickProps = {
	x?: number;
	y?: number;
	payload?: { value: number; offset: number; index: number };
	minPrice: number;
	avgPrice: number;
	maxPrice: number;
};

const chartMargin = { top: 60, right: 20, bottom: 10, left: 40 }; // ✅ 플롯영역 계산에 사용

const PriceChart = () => {
	const searchParams = useSearchParams();
	const q = searchParams.get('q') ?? '';
	const { categories } = useCategories();

	const [query, setQuery] = useState(q);
	const menuData = priceSummaryMap[query];

	const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
	const [clickedPoint, setClickedPoint] = useState<ClickedPoint>(null);
	const [draggingPoint, setDraggingPoint] = useState<ClickedPoint>(null);
	const [showTooltip, setShowTooltip] = useState(true);

	// 차트 렌더 영역(플롯) 기준으로 좌표 계산하기 위해 이 div에 ref
	const chartAreaRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setQuery(q);
		if (menuData) setSelectedPrice(menuData.avgPrice);
	}, [q, menuData]);

	const maxStoreRaw = Math.max(...mockGraph.map((d) => d.store));
	const yMax = Math.ceil(maxStoreRaw / 5) * 5;
	const { minPrice, maxPrice, avgPrice } = menuData;

	// 선택된 가격대 가게 리스트
	const selectedStores = useMemo(() => {
		if (selectedPrice === null) return [];
		return mockStores.filter((store) =>
			store.menuPrices?.some((menu) => menu.price === selectedPrice),
		);
	}, [selectedPrice]);
	if (!menuData) return null;
	const storeCount = selectedStores.length;

	// 선형 보간: 가격 → 가게수(store)
	const interpolateY = (price: number, points: GraphPoint[]): number => {
		for (let i = 0; i < points.length - 1; i++) {
			const p1 = points[i];
			const p2 = points[i + 1];
			if (price >= p1.price && price <= p2.price) {
				const ratio = (price - p1.price) / (p2.price - p1.price);
				return p1.store + ratio * (p2.store - p1.store);
			}
		}
		// 범위 밖이면 양 끝으로 클램프
		if (price < points[0].price) return points[0].store;
		if (price > points[points.length - 1].price)
			return points[points.length - 1].store;
		return 0;
	};

	// 픽셀↔값 변환(마진/플롯영역 고려)
	const getScales = () => {
		const rect = chartAreaRef.current!.getBoundingClientRect();
		const plotW = rect.width - chartMargin.left - chartMargin.right;
		const plotH = rect.height - chartMargin.top - chartMargin.bottom;

		const priceToX = (price: number) =>
			chartMargin.left + ((price - minPrice) / (maxPrice - minPrice)) * plotW;

		const xToPrice = (x: number) => {
			const nx = Math.min(Math.max(x - chartMargin.left, 0), plotW);
			return Math.round(minPrice + (nx / plotW) * (maxPrice - minPrice));
		};

		const storeToY = (store: number) =>
			chartMargin.top + (1 - store / yMax) * plotH;

		return { rect, plotW, plotH, priceToX, xToPrice, storeToY };
	};

	// 드래그 시작
	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (!chartAreaRef.current) return;

		const onMouseMove = (ev: MouseEvent) => {
			const { rect, priceToX, xToPrice, storeToY } = getScales();
			// 차트 영역 밖에서도 자연스럽게 동작하도록 클램프
			const x = Math.min(Math.max(ev.clientX - rect.left, 0), rect.width);
			const p = xToPrice(x);
			const yVal = interpolateY(p, mockGraph);

			setDraggingPoint({
				price: p,
				store: yVal,
				cx: priceToX(p),
				cy: storeToY(yVal),
			});
		};
		console.log(e);
		const onMouseUp = () => {
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onMouseUp);

			if (!draggingPoint) return;

			// 멈춘 가격으로 선택 상태 확정
			setSelectedPrice(draggingPoint.price);

			// 정확히 일치하는 가격의 가게가 없으면 툴팁/목록 숨김
			const hasStores = mockStores.filter((s) =>
				s.menuPrices?.some((m) => m.price === draggingPoint.price),
			);

			if (hasStores.length > 0) {
				setClickedPoint(draggingPoint);
			} else {
				setClickedPoint(null);
			}

			// 드래그 원 제거
			setDraggingPoint(null);
		};

		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);
	};

	// 점 클릭(기존 동작 유지)
	const handlePointClick = (
		data: GraphPoint,
		_index: number,
		event: React.MouseEvent<SVGElement, MouseEvent>,
	) => {
		const native = event.nativeEvent as MouseEvent & {
			offsetX: number;
			offsetY: number;
		};
		setSelectedPrice(data.price);
		setClickedPoint({
			price: data.price,
			store: data.store,
			cx: native.offsetX,
			cy: native.offsetY,
		});
	};

	// X축 커스텀
	const CustomXAxisTick = ({
		x = 0,
		y = 0,
		payload,
		minPrice,
		avgPrice,
		maxPrice,
	}: CustomTickProps) => {
		if (!payload) return null;
		let label = '';
		if (payload.value === minPrice) label = '최저';
		if (payload.value === avgPrice) label = '평균';
		if (payload.value === maxPrice) label = '최고';
		return (
			<g transform={`translate(${x},${y})`}>
				<text dy={10} textAnchor="middle" fill="#333" fontSize={12}>
					{payload.value.toLocaleString()}원
				</text>
				{label && (
					<text dy={25} textAnchor="middle" fill="#666" fontSize={11}>
						{label}
					</text>
				)}
			</g>
		);
	};

	return (
		<div className="bg-grey-10 p-4 min-h-screen space-y-3">
			{/* 헤더 */}
			<div className="ml-2">
				{categories
					?.filter((item) => item.name === query)
					.map((item, idx) => (
						<div key={idx} className="p-2 relative">
							<Icon name={item.icon} size="xxl" />
							<span className="text-[24px] text-primary-40 font-semibold">
								{item.name}
							</span>
							<span className="text-[24px] text-grey-90 font-semibold">
								는 1인 평균
							</span>
							<div className="flex flex-wrap items-center gap-1">
								<span className="text-[24px] text-grey-90 font-semibold">
									{avgPrice.toLocaleString()}원이에요.
								</span>
								<Icon name="WarningMark" onClick={() => setShowTooltip(true)} />
							</div>
							{showTooltip && (
								<div className="absolute left-1/2 top-full w-max -translate-x-1/4 mb-2 z-10">
									<div className="relative right-[40px] px-2 py-1 rounded-[10px] bg-grey-90 text-xs shadow">
										<div className="flex items-center gap-2">
											<span className="text-primary-40">
												6개월 내 제주도에 존재하는 가게들의 평균값이에요
											</span>
											<Icon
												name="Cancel"
												size="xxs"
												className="text-white"
												onClick={() => setShowTooltip(false)}
											/>
										</div>
										<div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full w-0 h-0 border-x-7 border-x-transparent border-b-8 border-t-black"></div>
									</div>
								</div>
							)}
						</div>
					))}
			</div>

			{/* 차트 */}
			<div className="bg-white h-[340px] p-4 rounded-xl flex flex-col justify-between">
				<div className="flex justify-between items-center">
					<span className="text-[16px] font-semibold text-[#000000]">
						가격 비교
					</span>
					<div className="flex items-center gap-3">
						<div className="w-[120px] mt-1">
							<ResponsiveContainer width="100%" height={10}>
								<BarChart data={[{ value: avgPrice }]} layout="vertical">
									<defs>
										<linearGradient id="gradColor" x1="0" y1="0" x2="1" y2="0">
											<stop offset="0%" stopColor="#CFCFCF" />
											<stop offset="50%" stopColor="#FF730F" />
											<stop offset="100%" stopColor="#FF2E04" />
										</linearGradient>
									</defs>
									<XAxis type="number" hide />
									<YAxis type="number" hide />
									<Bar
										dataKey="value"
										fill="url(#gradColor)"
										radius={[10, 10, 10, 10]}
										maxBarSize={12}
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
						<div className="flex flex-col items-center">
							<div className="relative mt-3 h-2 bg-gray-100 rounded-full w-[80px] overflow-hidden">
								<div
									className="absolute top-0 left-0 h-full rounded-full"
									style={{
										width: `100%`,
										background:
											'linear-gradient(to right, #D4DEE5, #38DEFF, #1A73E9)',
									}}
								/>
							</div>
							<div className="flex justify-between gap-10 text-xs text-gray-500 mt-1">
								<span>적은</span>
								<span>많은</span>
							</div>
						</div>
					</div>
				</div>

				{/* 드래그 캡처용 래퍼 (플롯영역 크기 기준) */}
				<div
					ref={chartAreaRef}
					onMouseDown={handleMouseDown}
					className="w-full h-[250px] relative"
				>
					<ResponsiveContainer width="100%" height="100%">
						<ScatterChart margin={chartMargin}>
							<defs>
								<linearGradient id="gradLine" x1="0" y1="0" x2="1" y2="0">
									<stop offset="0%" stopColor="#D4DEE5" />
									<stop offset="25%" stopColor="#38DEFF" />
									<stop offset="50%" stopColor="#1A73E9" />
									<stop offset="75%" stopColor="#38DEFF" />
									<stop offset="100%" stopColor="#D4DEE5" />
								</linearGradient>
							</defs>

							{/* 격자/선/포인트 */}
							<CartesianGrid strokeDasharray="3 0" vertical={false} />
							<Line
								type="monotone"
								data={mockGraph}
								dataKey="store"
								stroke="url(#gradLine)"
								strokeWidth={3}
								dot={false}
								isAnimationActive={false}
							/>
							<Scatter
								data={mockGraph}
								fill="#8884d8"
								cursor="pointer"
								onClick={handlePointClick}
							/>

							{/* 드래그 중 표시되는 원 (보간된 선 위) */}
							{draggingPoint && (
								<circle
									cx={draggingPoint.cx}
									cy={draggingPoint.cy}
									r={8}
									fill="white"
									stroke="#177BEC"
									strokeWidth={4}
								/>
							)}

							{/* 선택된 가격(존재할 때만 파란 테두리) */}
							{selectedPrice && (
								<Scatter
									data={mockGraph.filter((d) => d.price === selectedPrice)}
									fill="#FF2626"
									shape={(props: ScatterPointItem) => (
										<circle
											cx={props.cx}
											cy={props.cy}
											r={8}
											fill="white"
											stroke="#177BEC"
											strokeWidth={4}
										/>
									)}
								/>
							)}

							{/* 축 */}
							<XAxis
								dataKey="price"
								type="number"
								domain={[minPrice, maxPrice]}
								ticks={[minPrice, avgPrice, maxPrice]}
								axisLine={false}
								tickLine={false}
								tickMargin={8}
								tick={(props) => (
									<CustomXAxisTick
										{...props}
										minPrice={minPrice}
										avgPrice={avgPrice}
										maxPrice={maxPrice}
									/>
								)}
							/>
							<YAxis
								dataKey="store"
								type="number"
								domain={[0, yMax]}
								ticks={Array.from({ length: yMax / 5 + 1 }, (_, i) => i * 5)}
								tickMargin={7}
								tickLine={false}
								axisLine={false}
								label={{
									value: '(단위: 가게 수)',
									position: 'top',
									offset: 20,
									style: { fontSize: 12, fill: '#666' },
									dx: 34,
								}}
							/>
						</ScatterChart>
					</ResponsiveContainer>

					{/* 드래그 종료 후에만 나오는 툴팁/마커 */}
					{clickedPoint && (
						<>
							<svg className="absolute inset-0 pointer-events-none">
								<circle
									cx={clickedPoint.cx}
									cy={clickedPoint.cy}
									r={8}
									fill="white"
									stroke="#FF2626"
									strokeWidth={4}
								/>
							</svg>
							<div
								className="absolute"
								style={{
									left: clickedPoint.cx - 40,
									top: clickedPoint.cy - 60,
								}}
							>
								<div className="w-[75px] py-1.5 rounded-xl bg-grey-90 flex flex-col items-center text-xs shadow relative">
									<div className="text-white text-[12px]">
										{clickedPoint.price.toLocaleString()}원
									</div>
									<div className="flex gap-1 text-[9px]">
										<span className="text-white">가게</span>
										<span className="text-primary-40">
											{clickedPoint.store}
										</span>
									</div>
									<div className="absolute left-1/2 -bottom-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-black transform -translate-x-1/2"></div>
								</div>
							</div>
						</>
					)}
				</div>
			</div>

			{/* 가게 리스트 */}
			{selectedPrice && (
				<>
					<span className="text-lg font-semibold text-[20px]">
						{selectedPrice.toLocaleString()}원인 가게들이에요
					</span>
					<span className="text-primary-40 ml-2 text-[20px]">{storeCount}</span>
					<div className="bg-white rounded-xl mt-4">
						<div className="flex flex-wrap justify-between">
							{selectedStores.length > 0 ? (
								selectedStores.map((store, idx, arr) => {
									const mappedStore = {
										id: store.id,
										storeImageUrl: store.storeImageUrl ?? '/default.png',
										storeName: store.storeName,
										isKindStore: store.isKindStore ?? false,
										mainMenus: store.mainMenus ?? [store.mainMenu ?? ''],
										reviewCount: store.reviewCount ?? 0,
										valueScore: store.valueScore ?? 0,
										topPercent: store.topPercent ?? 0,
										address: store.address,
										rating: store.rating ?? 0,
										distance: store.distance,
									};
									return (
										<div key={store.id} className="flex flex-col">
											<StoreInfoCard review={mappedStore} />
											{idx < arr.length - 1 && (
												<div className="w-full h-px bg-grey-10 my-4" />
											)}
										</div>
									);
								})
							) : (
								<p className="text-sm text-gray-500">
									해당 가격대 메뉴가 없습니다.
								</p>
							)}
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default PriceChart;
