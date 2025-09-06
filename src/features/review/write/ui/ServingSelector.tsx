import clsx from 'clsx';

import SingleCategorySelect from '@/shared/ui/SingleCategorySelect';

interface ServingSelectorProps {
	value: number;
	onChange: (val: number) => void;
}

//FIXME: 기타 처리 (현재 기타 선택 시 에러 발생 0으로처리되어..)
const SERVING_OPTIONS = [1, 2, 3, 4, '기타'];

export const ServingSelector = ({ value, onChange }: ServingSelectorProps) => {
	return (
		<SingleCategorySelect
			value={value}
			onChange={onChange}
			className="flex items-center whitespace-pre gap-3"
		>
			{SERVING_OPTIONS.map((label, idx) => (
				<SingleCategorySelect.Item
					key={idx}
					value={typeof label === 'number' ? label : 0}
					className="w-12 h-12 rounded-lg border-none p-0"
				>
					{(isActive) => (
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
					)}
				</SingleCategorySelect.Item>
			))}
			<label
				htmlFor="serving"
				className="block mb-1 text-sm font-medium text-grey-80"
			>
				<b className="text-lg text-grey-90">인분</b>으로
			</label>
		</SingleCategorySelect>
	);
};
