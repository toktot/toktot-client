interface KeywordLabelProps {
	label: string;
}

const KeywordLabel = ({ label }: KeywordLabelProps) => {
	return (
		<span className="rounded p-1 bg-[#171D29CC] shrink-0 ">
			<span className="text-grey-10">{label}</span>
		</span>
	);
};

export default KeywordLabel;
