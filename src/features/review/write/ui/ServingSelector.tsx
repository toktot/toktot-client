import clsx from 'clsx';

interface ServingSelectorProps {
	value: number | null;
	onChange: (val: number | null) => void;
}

const SERVING_OPTIONS = [1, 2, 3, 4, '기타'];

export const ServingSelector = ({ value, onChange }: ServingSelectorProps) => {
	return (
		<div className="flex items-center whitespace-pre gap-3">
			{SERVING_OPTIONS.map((label, idx) => {
				const optionValue = typeof label === 'number' ? label : null;
				const isActive = value === optionValue;

				return (
					<button
						key={idx}
						type="button"
						onClick={() => onChange(optionValue)}
						className="w-12 h-12 rounded-lg border-none p-0"
					>
						<div
							className={clsx(
								'w-full h-full flex items-center justify-center rounded-lg font-bold text-xl',
								isActive
									? 'bg-grey-90 text-grey-10'
									: 'bg-grey-10 text-grey-50',
							)}
						>
							{label}
						</div>
					</button>
				);
			})}
			<label
				htmlFor="serving"
				className="block mb-1 text-sm font-medium text-grey-80"
			>
				<b className="text-lg text-grey-90">인분</b>으로
			</label>
		</div>
	);
};
