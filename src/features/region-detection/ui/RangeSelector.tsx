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
				className="rounded-xl px-3 py-1 mb-5 w-[50px] h-[29px] text-[14px] bg-grey-10 text-grey-60"
				onClick={() => handleRadiusChange(0)}
			>
				전체
			</button>
			<div className="flex items-center justify-between relative h-6">
				{RANGE_STEPS.map((step, idx) => {
					const isFilled = step <= radius;

					return (
						<div
							key={step}
							className={`${idx === 0 ? '' : 'flex  flex-1  items-center'}`}
						>
							{/* 선: 앞쪽 점과 현재 점 사이 */}
							{idx > 0 && (
								<div
									className={`flex-1 h-1 ${
										step <= radius ? 'bg-sky-400' : 'bg-gray-200'
									}`}
								/>
							)}

							{/* 점 */}
							<div
								className={`w-5 h-5 rounded-full border-2 transition-all duration-150 cursor-pointer ${
									isFilled
										? 'bg-sky-400 border-sky-400'
										: 'bg-gray-100 border-gray-300'
								}`}
								onClick={() => handleRadiusChange(step)}
							/>
						</div>
					);
				})}
			</div>

			{/* 라벨 */}
			<div className="mt-2 flex ml-1 justify-between text-[] text-gray-500">
				{RANGE_STEPS.map((step) => (
					<span key={step}>{`${step}m`}</span>
				))}
			</div>
			<div className="mt-4 text-xl text-grey-90 text-center">
				{radius === 0 ? '전체 거리' : `${radius}m 이내`}
			</div>
		</div>
	);
};
