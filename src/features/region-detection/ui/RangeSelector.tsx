import { useSearchParams } from 'next/navigation';

import { useRadius } from '../model/RadiusContext';
import { RANGE_STEPS } from '../model/constants';
import { RangeStep } from '../model/types';

export const RangeSelector = () => {
	const searchParams = useSearchParams();
	const { setRadius: setRadiusContext } = useRadius();
	console.log(setRadiusContext);
	const { radius, setRadius } = useRadius();

	const handleRadiusChange = (newRadius: RangeStep) => {
		setRadius(newRadius);

		const params = new URLSearchParams(searchParams.toString());
		if (newRadius === 0) {
			params.delete('radius');
		} else {
			params.set('radius', String(newRadius));
		}
	};
	console.log(radius);

	return (
		<div className="relative w-full">
			{/* FIXME: 공용버튼으로 변경 */}
			<button
				className="rounded-xl px-3 py-1 mb-5 w-[49px] h-[29px] text-[14px] bg-grey-10 text-grey-60"
				onClick={() => handleRadiusChange(0)}
			>
				전체
			</button>
			<div className="relative w-full px-2">
				<div className="flex items-center justify-between relative h-6">
					{RANGE_STEPS.map((step, idx) => {
						const isFilled = step <= radius;
						const isCenter = idx === Math.floor(RANGE_STEPS.length / 2);

						return (
							<div
								key={step}
								className="flex-1 flex flex-col items-center relative"
							>
								{/* 점 + 선 묶음 */}
								<div className="flex items-center w-full">
									{/* 왼쪽 선 */}
									{idx > 0 && (
										<div
											className={`flex-1 h-1 ${
												RANGE_STEPS[idx] <= radius
													? 'bg-sky-400'
													: 'bg-gray-200'
											}`}
										/>
									)}

									{/* 점 */}
									<div
										className={`rounded-full  transition-all duration-150 cursor-pointer z-10 ${
											isFilled ? 'bg-sky-400 ' : 'bg-gray-100 '
										} ${isCenter ? 'w-7 h-7' : 'w-4 h-4'}`}
										onClick={() => handleRadiusChange(step)}
									/>

									{/* 오른쪽 선 */}
									{idx < RANGE_STEPS.length - 1 && (
										<div
											className={`flex-1 h-1 ${
												RANGE_STEPS[idx + 1] <= radius
													? 'bg-sky-400'
													: 'bg-gray-200'
											}`}
										/>
									)}
								</div>

								{/* 점 밑 라벨 */}
							</div>
						);
					})}
				</div>
				<div className="flex justify-between mt-2 text-[11px] text-grey-70">
					{RANGE_STEPS.map((step) => (
						<span key={step} className={`${step >= 800 ? 'mr-1' : ''}`}>
							{step >= 1000 ? `${step / 1000}km` : `${step}m`}
						</span>
					))}
				</div>
			</div>

			{/* 라벨 */}

			<div className="mt-5 text-xl text-[#000000] text-[20px] font-semibold text-center">
				{radius === 0
					? '전체 거리'
					: radius >= 1000
						? `${radius / 1000}km 이내`
						: `${radius}m 이내`}
			</div>
		</div>
	);
};
