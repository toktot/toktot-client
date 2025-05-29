import { useEffect } from 'react';

import { clusterMarker } from '../lib/clusterMarker';
import { Coordinates } from '../model/types';

interface MarkerClustererProps {
	map: kakao.maps.Map;
	positions: Coordinates[];
}

export const MarkerClusterer = ({ map, positions }: MarkerClustererProps) => {
	useEffect(() => {
		if (!map || !positions.length) return;

		clusterMarker(map, positions);
	}, [map, positions]);

	return null; // UI는 그리지 않지만 부작용을 실행하는 컴포넌트
};
