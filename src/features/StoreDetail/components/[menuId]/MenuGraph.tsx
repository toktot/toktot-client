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
				marginTop: '20px',
				outline: 'none',
			}}
			tabIndex={-1}
		>
			<h3 className="text-[16px] ml-3 font-semibold text-[#000000]">
				가격추이
			</h3>
			<div className="w-full h-[260px]">
				<ResponsiveContainer className="outline-none">
					<LineChart
						data={graphData}
						className="outline-none"
						tabIndex={-1}
						margin={{ top: 20, right: 20, left: 0, bottom: 30 }}
					>
						<XAxis
							dataKey="day"
							tickFormatter={(d) => `${d}월`}
							tickMargin={16}
							tickLine={false}
							axisLine={false}
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
							cursor={false}
							content={({ active, payload, coordinate }) => {
								if (active && payload && payload.length && coordinate) {
									const { x, y } = coordinate;
									return (
										<div
											className="px-3 py-1 rounded-md bg-grey-90 text-primary-40 text-xs shadow absolute whitespace-nowrap"
											style={{
												left: x - 10,
												top: y - 50,
												transform: 'translateX(-50%)',
												pointerEvents: 'none',
											}}
										>
											<span>{`${payload[0].value.toLocaleString()}원`}</span>
											<div className="absolute left-2/3 -bottom-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-black transform -translate-x-1/2"></div>
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
							activeDot={false}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default MenuChart;
