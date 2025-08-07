'use client';

import { mockGraphByMenuId } from '@/entities/menuPrice/mockdayPrice';
import { useParams } from 'next/navigation';
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

const MenuChart = () => {
	const params = useParams();

	const menuId = params.menuId as string;
	const graphData = mockGraphByMenuId[menuId];
	if (!graphData) return <p>데이터가 없습니다.</p>;

	const prices = graphData.map((d) => d.price);
	const minPrice = Math.min(...prices);
	const maxPrice = Math.max(...prices);
	const yMin = Math.floor((minPrice - 3000) / 1000) * 1000;

	const yMax = Math.ceil((maxPrice + 3000) / 1000) * 1000;
	const midPrice = Math.floor((yMin + yMax) / 2 / 1000) * 1000;

	return (
		<div
			style={{
				width: '100%',
				height: 300,
				backgroundColor: 'white',
				borderRadius: '12px',
				padding: '1rem',
				marginTop: '-40px',
			}}
		>
			<h3 className="text-[16px] font-semibold text-[#000000]">가격추이</h3>
			<ResponsiveContainer>
				<LineChart
					data={graphData}
					margin={{ top: 20, right: 30, left: 30, bottom: 30 }}
				>
					<XAxis
						dataKey="day"
						tickFormatter={(d) => `${d}월`}
						tickMargin={16}
						tick={{ fontSize: 11, fill: '#333C4A' }}
					/>
					<YAxis
						domain={[yMin, yMax]}
						tickFormatter={(v) => `${v.toLocaleString()}원`}
						ticks={[yMin, midPrice, yMax]}
						axisLine={false}
						tickLine={false}
						tick={{ fontSize: 9, fill: '#74808E' }}
					/>
					<CartesianGrid strokeDasharray="3 0" vertical={false} />
					<Tooltip
						content={({ active, payload }) => {
							if (active && payload && payload.length) {
								return (
									<div className="relative top-[-60px] left-[-47px] px-3 py-1 rounded-md bg-grey-90 text-primary-40 text-xs shadow">
										<span>{`${payload[0].value.toLocaleString()}원`}</span>
										<div className="absolute left-1/2 -bottom-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-black transform -translate-x-1/2"></div>
									</div>
								);
							}
							return null;
						}}
					/>
					<Line
						type="monotone"
						dataKey="price"
						stroke="#00bfff"
						strokeWidth={3}
						dot={{ r: 4, fill: '#00bfff' }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};

export default MenuChart;
