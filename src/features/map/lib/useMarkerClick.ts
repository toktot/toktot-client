import { useEffect } from 'react';

export const useMarkerClick = ({
	marker,
	onClick,
}: {
	marker: kakao.maps.Marker | null;
	onClick: () => void;
}) => {
	useEffect(() => {
		if (!marker) return;

		kakao.maps.event.addListener(marker, 'click', onClick);

		return () => {
			kakao.maps.event.removeListener(marker, 'click', onClick);
		};
	}, [marker, onClick]);
};
