export function useImageCoordinate(
	ref: React.RefObject<HTMLImageElement | null>,
) {
	const getRelativeCoord = (e: React.MouseEvent) => {
		if (!ref.current) return null;

		const { left, top, width, height } = ref.current.getBoundingClientRect();
		const x = ((e.clientX - left) / width) * 100;
		const y = ((e.clientY - top) / height) * 100;
		return { x, y };
	};

	return { getRelativeCoord };
}
