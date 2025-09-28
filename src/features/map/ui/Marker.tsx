import { useEffect, useState } from 'react';

import { useMarkerClick } from '../lib/useMarkerClick';

interface MarkerProps {
	map: kakao.maps.Map;
	position: { lat: number; lng: number };
	onClick?: () => void;
	isMarkerClicked?: boolean;
	user?: string | null;
}

export function Marker({
	map,
	position,
	onClick,
	isMarkerClicked,
	user,
}: MarkerProps) {
	const [marker, setMarker] = useState<kakao.maps.Marker | null>(null);
	useMarkerClick({ marker, onClick: onClick || (() => {}) });

	useEffect(() => {
		if (!map) return;

		if (!isMarkerClicked) {
			const content = document.createElement('div');
			content.style.width = '40px';
			content.style.height = '40px';
			content.style.borderRadius = '50%';
			content.style.overflow = 'hidden';
			content.style.display = 'flex';
			content.style.alignItems = 'center';
			content.style.justifyContent = 'center';
			content.style.border = '2px solid #3AC8FF';
			content.style.background = '#fff';

			// ✅ Next.js <Image> 대신 일반 <img> 사용
			const img = document.createElement('img');
			img.src = '/images/Checker.png'; // public/images/Checker.png
			img.alt = 'Checker';
			img.style.width = '100%';
			img.style.height = '100%';
			img.style.objectFit = 'cover';
			content.appendChild(img);

			const overlay = new kakao.maps.CustomOverlay({
				position: new kakao.maps.LatLng(position.lat, position.lng),
				content,
				yAnchor: 1,
			});

			overlay.setMap(map);
			content.addEventListener('click', onClick || (() => {}));

			return () => {
				overlay.setMap(null);
				content.removeEventListener('click', onClick || (() => {}));
			};
		} else {
			// 📌 기본 마커
			const instance = new kakao.maps.Marker({
				map,
				position: new kakao.maps.LatLng(position.lat, position.lng),
			});
			setMarker(instance);

			return () => {
				instance.setMap(null);
			};
		}
	}, [map, position, isMarkerClicked, user, onClick]);

	return null;
}
