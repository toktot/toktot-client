import { useRadius } from '../model/RadiusContext';
import { RANGE_STEPS } from '../model/constants';

export const RangeSelector = () => {
	const minRange = RANGE_STEPS[0];
	const maxRange = RANGE_STEPS[RANGE_STEPS.length - 1];
	const { radius, setRadius } = useRadius();

	return (
		<div className="relative w-full">
			{/* FIXME: 공용버튼으로 변경 */}
			<button
				className="ring-1 rounded-xl px-3 py-1 mb-5"
				onClick={() => setRadius(0)}
			>
				전체
			</button>
			<div className="flex items-center justify-between relative h-6">
				{RANGE_STEPS.map((step, idx) => {
					const isFilled = step <= radius;

					return (
						<div
							key={step}
							className={`${step === 1 ? '' : 'flex  flex-1  items-center'}`}
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
								onClick={() => setRadius(step)}
							/>
						</div>
					);
				})}
			</div>

			{/* 라벨 */}
			<div className="mt-2 flex justify-between text-xs text-gray-500">
				<span>{`${minRange}km`}</span>
				<span>{`${maxRange}km`}</span>
			</div>
		</div>
	);
};
