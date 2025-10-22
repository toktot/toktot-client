'use client';

import React, { useEffect, useMemo, useState } from 'react';

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

import StoreInfoCard, { StoreInfoCardProps } from '@/shared/components/StoreCard';
import { useCategories } from '@/shared/hooks/useCategories';
import Icon from '@/shared/ui/Icon';
import api from '@/features/home/lib/api';
type PriceDistribution = {
  cheapCount: number;
  normalCount: number;
  expensiveCount: number;
  cheapRatio: number;
  normalRatio: number;
  // 백엔드가 expensiveRatio(정상) 또는 expensiveRation(오타) 둘 중 하나를 줄 수 있어 둘 다 대응
  expensiveRatio?: number;
  expensiveRation?: number;
};

type PriceRange = {
  minPrice: number;
  maxPrice: number;
  reviewCount: number;
  label: string;
};


type ApiStatsData = {
  localFoodType: string;
  displayName: string;
  totalReviewCount: number;
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
  hasSufficientData: boolean;
  lastUpdated: string;
  priceDistribution: PriceDistribution;
  priceRanges: PriceRange[];
};

type ApiStats = {
  success: boolean;
  data: ApiStatsData;
};
type PriceRangeRestaurant = {
  restaurant_id: number;
  restaurant_name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  distance?: number; // km 가정
  average_rating?: number;
  review_count?: number;
  is_good_price_store?: boolean;
  is_local_store?: boolean;
  image_url?: string;
  average_price_in_range?: number;
};

const toStoreCardReview = (it: PriceRangeRestaurant): StoreInfoCardProps['review'] => ({
  id: it.restaurant_id,
  name: it.restaurant_name,
  address: it.address ?? '',
  // 반드시 string | null 로 변환
  distance: typeof it.distance === 'number' ? `${it.distance}km` : (it.distance ?? null),
  // 카드가 기대하는 키 이름에 맞추기
  main_menus: null, // API에 없으므로 null
  average_rating: it.average_rating ?? 0,
  review_count: it.review_count ?? 0,
  is_good_price_store: it.is_good_price_store ?? null,
  is_local_store: it.is_local_store ?? null,
  image: it.image_url ?? null,
  topPercent: null,   // API에 없으면 null
  valueScore: null,   // API에 없으면 null
});
type PriceRangeRestaurantsResponse = {
  success: boolean;
  data: {
    content: PriceRangeRestaurant[];
    totalElements: number;
    totalPages: number;
    last: boolean;
    number: number;
    size: number;
  };
};
type PriceRangeRestaurantsRequest = {
  local_food_type: string;
  clicked_price: number;
};

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

const NAME_TO_ENUM: Record<string, string> = {
  // 필요에 맞게 계속 추가하세요
  '돔베고기': 'DOMBE_MEAT',
  '고기국수': 'MEAT_NOODLE',
  '흑돼지': 'BLACK_PORK',
  '성게알비빔밥': 'SEA_URCHIN_BAP',
  
};

const PriceChart = () => {
	const searchParams = useSearchParams();
	const q = searchParams.get('q') ?? '';
	const { categories } = useCategories();

	const [query, setQuery] = useState(q);
	useEffect(() => {
		setQuery(q);
	}, [q]);
	
	const [, setLoading] = useState(false);
	const [, setError] = useState<string| null>(null);
	const [stats, setStats] = useState<ApiStats['data'] | null>(null);
	const avgPrice = stats?.averagePrice ?? 0;
	// ⬇️ 선택된 가게들을 StoreInfoCard가 기대하는 타입으로 보관
const [selectedStores, setSelectedStores] = useState<StoreInfoCardProps['review'][]>([]);
;
const [, setStoreLoading] = useState(false);
const [, setStoreError] = useState<string | null>(null);
	const [showGuide, setShowGuide] = useState(true);
	const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
	const [clickedPoint, setClickedPoint] = useState<ClickedPoint>(null);
	const [showTooltip, setShowTooltip] = useState(true);
	const graphData: GraphPoint[] = useMemo(() => {
  const ranges = Array.isArray(stats?.priceRanges) ? stats!.priceRanges : [];
  return ranges.map((r) => ({
    price: Math.round((r.minPrice + r.maxPrice) / 2),
    store: r.reviewCount,
  }));
}, [stats]);

  

  // ====== API 호출 ======
  useEffect(() => {
    const typeEnum = NAME_TO_ENUM[query];
	if (!typeEnum) {
    setStats(null);
    return;
  }
   
	let cancelled = false;
    const toNum = (v: unknown, def = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : def;
  };
    const run = async () => {
		setLoading(true);
    setError(null);
	try {
      
	  const res = await api.get<ApiStats>(`/v1/local-foods/${typeEnum}/stats`);
      if (!res.data?.success || !res.data?.data) throw new Error('Invalid response');
		console.log(res.data.data);

      const d = res.data.data;
      const norm = {
        ...d,
        averagePrice: toNum(d.averagePrice),
        minPrice: toNum(d.minPrice),
        maxPrice: toNum(d.maxPrice),
        priceDistribution: {
          ...d.priceDistribution,
          cheapCount: toNum(d.priceDistribution?.cheapCount),
          normalCount: toNum(d.priceDistribution?.normalCount),
          expensiveCount: toNum(d.priceDistribution?.expensiveCount),
          cheapRatio: toNum(d.priceDistribution?.cheapRatio),
          normalRatio: toNum(d.priceDistribution?.normalRatio),
          expensiveRatio: toNum(
    d.priceDistribution?.expensiveRatio ?? d.priceDistribution?.expensiveRation ?? 0
  ),
        },
        priceRanges: Array.isArray(d.priceRanges)
          ? d.priceRanges
              .map((r) => ({
                minPrice: toNum(r.minPrice),
                maxPrice: toNum(r.maxPrice),
                reviewCount: toNum(r.reviewCount),
                label: String(r.label ?? ''),
              }))
              .filter((r) => r.minPrice <= r.maxPrice)
          : [],
      };
	  
        if (!cancelled) setStats(norm as ApiStats['data']);
		
      } catch (e) {
        if (!cancelled) {
          console.log(e)
        setStats(null);
        }
      } finally {
        if (!cancelled) setStoreLoading(false);
      }
    };
    run();
	
    return () => { cancelled = true; };
  }, [query]);
  useEffect(() => {
	console.log('api호출이 되는 거겠지?')
	const typeEnum = NAME_TO_ENUM[query];
	if (!selectedPrice || !typeEnum) {
		setSelectedStores([]);
		setStoreError(null);
		return;
	}
	let cancelled = false;

	const run = async () => {
		try {
			setStoreLoading(true);
			setStoreError(null);

			const body: PriceRangeRestaurantsRequest = {
          local_food_type: typeEnum,
          clicked_price: Number(selectedPrice),
        };
			const params = 'page=0&size=20&sort=distance,asc';
      const res = await api.post<PriceRangeRestaurantsResponse>(
        `/v1/local-foods/price-range/restaurants?${params}`,
        body
      );
	  if (!res.data?.success || !res.data?.data) {
        throw new Error('Invalid response');
      }

      const list = res.data.data.content ?? [];
      const mapped = list.map(toStoreCardReview);

      if (!cancelled) setSelectedStores(mapped);
		} catch(e) {
			if (!cancelled) {
				console.log(e)
        setSelectedStores([]);
      }
    } finally {
      if (!cancelled) setStoreLoading(false);
    }
		}
		run();
		 return () => {cancelled = true};
	
  }, [selectedPrice, query])
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
const yMax = graphData.length ? Math.max(...graphData.map((d) => d.store)) : 0;
const yTop = Math.max(5, Math.ceil(yMax / 5) * 5); // 최소 5 눈금
const yTicks = Array.from({ length: yTop / 5 + 1 }, (_, i) => i * 5);

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
	if (!stats) {
		return null;
	}
	return (
		<div className="bg-grey-10 py-4 px-4 min-h-screen space-y-3 cursor-pointer">
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
							<div className="flex flex-wrap items-center gap-1 relative">
								<span className="text-[24px] text-grey-90 font-semibold">
									{stats?.averagePrice.toLocaleString()}원이에요.
								</span>
								<div className="relative">
									<Icon
										name="WarningMark"
										onClick={() => setShowTooltip(true)}
									/>
								</div>
								{showTooltip && (
									<div className="absolute left-1/2 top-full w-max -translate-x-[59%] mb-2 z-10">
										<div className="right-[40px] px-2 py-1 rounded-[10px] bg-grey-90 text-xs">
											<div className="flex items-center gap-2">
												<span className="text-primary-40">
													6개월 내 제주도에 존재하는 가게들의 평균값이에요
												</span>
												<span>
													<Icon
														name="Cancel"
														size="xxs"
														className="text-white"
														onClick={() => setShowTooltip(false)}
													/>
												</span>
											</div>
											<div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full w-0 h-0 border-x-7 border-x-transparent border-b-8 border-t-black"></div>
										</div>
									</div>
								)}
							</div>
						</div>
					))}
			</div>

			{/* 차트 */}
			<div className="bg-white h-[340px] p-4 rounded-xl flex flex-col justify-between relative">
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
								<span>적음</span>
								<span>많음</span>
							</div>
						</div>
					</div>
				</div>

				{/* 드래그 캡처용 래퍼 (플롯영역 크기 기준) */}
				<ResponsiveContainer width="100%" height="100%">
					<ScatterChart margin={{ top: 60, right: 10, bottom: 20, left: -30 }}>
						<defs>
							<linearGradient id="gradLine" x1="0" y1="0" x2="1" y2="0">
								<stop offset="0%" stopColor="#D4DEE5" />
								<stop offset="25%" stopColor="#38DEFF" />
								<stop offset="50%" stopColor="#1A73E9" />
								<stop offset="75%" stopColor="#38DEFF" />
								<stop offset="100%" stopColor="#D4DEE5" />
							</linearGradient>
						</defs>
						<XAxis
							dataKey="price"
							ticks={[stats.minPrice, stats.averagePrice, stats.maxPrice]}
							domain={[stats.minPrice, stats.maxPrice]}
							type="number"
							axisLine={false}
							tickLine={false}
							tickMargin={8}
							tick={(props) => (
								<CustomXAxisTick
									{...props}
									minPrice={stats?.minPrice}
									avgPrice={stats?.averagePrice}
									maxPrice={stats?.maxPrice}
								/>
							)}
						/>
						<YAxis
							dataKey="store"
							domain={[0, yTop] as [number, number]}
							ticks={yTicks}
							tickMargin={7}
							type="number"
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

						{/* 격자/선/포인트 */}
						<CartesianGrid strokeDasharray="3 0" vertical={false} />
						<Line
							type="monotone"
							data={graphData}
							dataKey="store"
							stroke="url(#gradLine)"
							strokeWidth={3}
							dot={false}
							isAnimationActive={false}
						/>
						<Scatter
							data={graphData}
							fill="#8884d8"
							cursor="pointer"
							onClick={(
								data: GraphPoint,
								index: number,
								event: React.MouseEvent<SVGElement, MouseEvent>,
							) => {
								handlePointClick(data, index, event);
							}}
						/>
						{clickedPoint && (
							<foreignObject
								x={clickedPoint.cx - 40}
								y={clickedPoint.cy - 60}
								width={120}
								height={60}
							>
								<div className="w-[75px] py-1.5 gap-0.5 rounded-xl bg-grey-90 flex flex-col items-center text-xs shadow relative">
									<div className="text-white text-[12px]">{`${clickedPoint.price.toLocaleString()}원`}</div>
									<div className="flex flex-wrap gap-1">
										<div className="text-white text-[9px]">{'가게'}</div>
										<div className="text-primary-40 text-[9px]">{`${clickedPoint.store}`}</div>
									</div>
									<div className="absolute left-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-black transform -translate-x-1/2"></div>
								</div>
							</foreignObject>
						)}
						{selectedPrice && (
							<Scatter
								data={graphData.filter((d) => d.price === selectedPrice)}
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
					</ScatterChart>
				</ResponsiveContainer>
				{showGuide && (
					<div
						className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/50 rounded-xl"
						onClick={() => setShowGuide(false)}
					>
						<button
							className="absolute top-1 right-1 p-1 z-80"
							onClick={() => setShowGuide(false)}
						>
							<Icon name="Cancel" size="xl" className="text-white" />
						</button>
						<div className="flex flex-col items-center text-center text-white">
							<div className="relative flex items-center justify-center">
								<div className="absolute -left-12 flex space-x-[-20px] opacity-70">
									<div className="w-[40px] h-[40px] rounded-full bg-cyan-400 opacity-50"></div>
									<div className="w-[48px] h-[48px] rounded-full bg-cyan-400"></div>
								</div>
								<div className="bg-primary-40 rounded-full w-[70px] h-[70px] flex items-center justify-center relative z-10">
									<span className="text-2xl text-black">{'↔'}</span>
								</div>
								<div className="absolute -right-12 flex space-x-[-20px] opacity-70">
									<div className="w-[48px] h-[48px] rounded-full bg-cyan-400"></div>
									<div className="w-[40px] h-[40px] rounded-full bg-cyan-400 opacity-50"></div>
								</div>
							</div>
							<p className="text-lg font-medium mt-2">좌우로 이동해</p>
							<p className="text-lg font-medium">
								구간별 가격/가게 정보를 확인해보세요
							</p>
						</div>
					</div>
				)}
			</div>

			{/* 가게 리스트 */}
			{selectedPrice && (
				<>
					<div className=" flex items-center gap-2">
						<span className=" font-semibold text-[20px]">
							<span className="text-primary-50">
								{selectedPrice.toLocaleString()}원
							</span>
							인 가게들이에요
						</span>

						<span className="rounded-full bg-white w-[31px] h-[21px]  flex items-center justify-center text-primary-40 text-[9px]">
							{selectedStores.length}개
						</span>
					</div>

					<div className="bg-white mt-4 -mx-4 min-h-[500px]">
						<div className="flex flex-wrap justify-between">
							{selectedStores.length > 0 ? (
								selectedStores.map((store, idx, arr) => (
									<div key={store.id} className="flex flex-col">
											<StoreInfoCard review={store} />
											{idx < arr.length - 1 && (
												<div className="w-full h-px bg-grey-10 my-4" />
											)}
										</div>
								))
							
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
