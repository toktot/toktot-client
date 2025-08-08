interface TooltipGuideOverlayProps {
	onDismiss: () => void;
}

export const TooltipGuideOverlay = ({
	onDismiss,
}: TooltipGuideOverlayProps) => {
	return (
		<div
			className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 flex-col gap-6"
			onClick={onDismiss}
		>
			<div className="w-12 h-12 rounded-full bg-[#D9D9D980] border-white border"></div>
			<div className="text-sm text-center text-white">
				태그할 대상을 클릭해주세요.
			</div>
		</div>
	);
};
