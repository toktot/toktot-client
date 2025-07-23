import SingleCategorySelect from '@/shared/ui/SingleCategorySelect';

interface ServingSelectorProps {
	value: number;
	onChange: (val: number) => void;
}

const SERVING_OPTIONS = [1, 2, 3, 4, '5+'];

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
					value={idx}
					className="w-12 h-12 bg-grey-10 rounded-lg flex flex-col justify-center items-center text-grey-50 text-xl font-bold border-none"
				>
					{label}
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
