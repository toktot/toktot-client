'use client';

import { useEffect, useState } from 'react';

import { mockGraph } from '@/entities/menuPrice/mockGraph';
import { useSearchParams } from 'next/navigation';
import {
	CartesianGrid,
	Line,
	ResponsiveContainer,
	Scatter,
	ScatterChart,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

import { priceSummaryMap } from '@/features/home/model/mockPriceSummary';

const PriceChart = () => {
	const searchParams = useSearchParams();
	const q = searchParams.get('q') ?? '';

	const [query, setQuery] = useState(q);
	const menuData = priceSummaryMap[query];
	useEffect(() => {
		setQuery(q);
	}, [q]);

	if (!menuData) {
		return;
	}

	const avgPrice = menuData?.avgPrice || 0;

	const matchingData = mockGraph.find(
		(item) => item.price === menuData.avgPrice,
	);
	console.log(matchingData);

	return (
		<div style={{ width: '100%', height: 300 }}>
			<h2>
				{query}는 1인 평균 <strong>{avgPrice.toLocaleString()}원</strong>이에요.
			</h2>
			<ResponsiveContainer>
				<ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
					<XAxis
						dataKey="price"
						domain={[menuData.minPrice, menuData.maxPrice]}
						type="number"
					/>
					<YAxis
						dataKey="people"
						domain={[menuData.minRate, menuData.maxRate]}
						type="number"
					/>
					<CartesianGrid strokeDasharray="3 0" vertical={false} />
					<Tooltip
						content={({ active, payload, label }) => {
							if (active && payload && payload.length) {
								return (
									<div className="relative top-[-60px] left-[-47px] px-3 py-1 rounded-md bg-grey-90 text-primary-40 text-xs shadow">
										<div className="font-semibold">{`가격: ${label?.toLocaleString()}원`}</div>
										<span>{`${payload[0].value.toLocaleString()}건 리뷰`}</span>
										<div className="absolute left-1/2 -bottom-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-black transform -translate-x-1/2"></div>
									</div>
								);
							}
							return null;
						}}
					/>

					<Line
						type="monotone"
						data={mockGraph}
						dataKey="people"
						stroke="#00bfff"
						strokeWidth={3}
						dot={false}
						isAnimationActive={false}
					/>
					<Scatter data={mockGraph} fill="#8884d8"></Scatter>
				</ScatterChart>
			</ResponsiveContainer>
		</div>
	);
};

export default PriceChart;
