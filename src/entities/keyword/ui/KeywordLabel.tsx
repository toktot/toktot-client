interface KeywordLabelProps {
	label: string;
}

const KeywordLabel = ({ label }: KeywordLabelProps) => {
	return (
		<span className="text-grey-10 rounded p-1 h-[26px] bg-[#171D29CC] shrink-0">
			{label}
		</span>
	);
};

export default KeywordLabel;
