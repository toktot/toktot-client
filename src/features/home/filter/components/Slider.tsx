import { useEffect, useRef, useState } from 'react';

interface PriceRangeProps {
	min: number;
	avg: number;
	max: number;
	onChange?: (minSelected: number, maxSelected: number) => void;
}

export default function PriceRangeSlider({
	min,
	avg,
	max,
	onChange,
}: PriceRangeProps) {
	const [minValue, setMinValue] = useState(min);
	const [maxValue, setMaxValue] = useState(max);

	useEffect(() => {
		onChange?.(minValue, maxValue);
	}, [minValue, maxValue, onChange]);

	const trackRef = useRef<HTMLDivElement | null>(null);

	const handleDrag = (
		e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
		type: 'min' | 'max',
	) => {
		e.preventDefault();
		const moveListener = (moveEvent: MouseEvent | TouchEvent) => {
			if (!trackRef.current) return;

			const trackRect = trackRef.current.getBoundingClientRect();
			const clientX =
				'touches' in moveEvent
					? moveEvent.touches[0].clientX
					: moveEvent.clientX;

			const percent = Math.min(
				Math.max((clientX - trackRect.left) / trackRect.width, 0),
				1,
			);
			const newValue = Math.round(min + percent * (max - min));

			if (type === 'min' && newValue < maxValue) setMinValue(newValue);
			if (type === 'max' && newValue > minValue) setMaxValue(newValue);
		};

		const upListener = () => {
			window.removeEventListener('mousemove', moveListener);
			window.removeEventListener('mouseup', upListener);
			window.removeEventListener('touchmove', moveListener);
			window.removeEventListener('touchend', upListener);
		};

		window.addEventListener('mousemove', moveListener, { passive: false });
		window.addEventListener('mouseup', upListener, { passive: false });
		window.addEventListener('touchmove', moveListener, { passive: false });
		window.addEventListener('touchend', upListener, { passive: false });
	};

	const minPercent = ((minValue - min) / (max - min)) * 100;
	const maxPercent = ((maxValue - min) / (max - min)) * 100;
	const avgPercent = ((avg - min) / (max - min)) * 100;

	return (
		<div className="w-full mt-8">
			<div className="relative h-2 bg-gray-200 rounded-full" ref={trackRef}>
				<div
					className="absolute h-2 bg-red-200 rounded-full"
					style={{
						left: `${minPercent}%`,
						width: `${maxPercent - minPercent}%`,
					}}
				/>
				{/* Min handle */}
				<div
					className="absolute w-6 h-6 bg-white border border-yellow-200 rounded-full cursor-pointer -top-1"
					style={{ left: `${minPercent}%` }}
					onMouseDown={(e) => handleDrag(e, 'min')}
					onTouchStart={(e) => handleDrag(e, 'min')}
				/>
				{/* Max handle */}
				<div
					className="absolute w-6 h-6 bg-white border border-red-300 rounded-full cursor-pointer -top-1"
					style={{ left: `${maxPercent}%` }}
					onMouseDown={(e) => handleDrag(e, 'max')}
					onTouchStart={(e) => handleDrag(e, 'max')}
				/>
				{/* Avg marker */}
				<div
					className="absolute w-6 h-6  -top-0.5"
					style={{ left: `${avgPercent}%` }}
				/>
			</div>

			<div className="flex justify-between mt-2 text-sm text-grey-90 font-semibold">
				<div className="flex flex-col items-center">
					<span>저렴한</span>
					<span className="text-xs text-grey-60">{min.toLocaleString()}원</span>
				</div>
				<div className="flex flex-col items-center">
					<span>평균</span>
					<span className="text-xs text-grey-60">{avg.toLocaleString()}원</span>
				</div>
				<div className="flex flex-col items-center">
					<span>값이 있는</span>
					<span className="text-xs text-grey-60">{max.toLocaleString()}원</span>
				</div>
			</div>

			{/* Selected range */}
			<div className="text-center mt-4 text-lg font-bold text-black">
				{`${minValue.toLocaleString()}원 ~ ${maxValue.toLocaleString()}원`}
			</div>
		</div>
	);
}
