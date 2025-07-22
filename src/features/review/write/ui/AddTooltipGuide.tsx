interface AddTooltipGuideProps {
	isVisible: boolean;
	onClick?: () => void;
}

export const AddTooltipGuide = ({
	isVisible,
	onClick,
}: AddTooltipGuideProps) => {
	if (!isVisible) return null;

	return (
		<div
			className="absolute inset-0 bg-black/40 text-white text-sm flex items-center justify-center z-20"
			onClick={onClick}
		>
			이미지 위를 클릭하여 툴팁을 추가할 수 있어요
		</div>
	);
};
