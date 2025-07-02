import Icon from '@/widgets/Icon';

export const ReviewImageUploader = ({
	onUpload,
}: {
	onUpload: (file: File) => void;
}) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) onUpload(file);
	};

	return (
		<div className="w-full gap-3 flex overflow-x-auto [&::-webkit-scrollbar]:hidden">
			<label className="w-[100px] h-[100px] bg-grey-10 flex items-center justify-center cursor-pointer rounded flex-shrink-0">
				<input type="file" className="hidden" onChange={handleChange} />
				<Icon className="text-grey-50" name={'Plus'} size="s" />
			</label>
		</div>
	);
};
