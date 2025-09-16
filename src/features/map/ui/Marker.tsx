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
			// 📌 프로필 이미지를 보여주는 custom overlay
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

			if (user) {
				const img = document.createElement('img');
				img.src = user;
				img.alt = 'user';
				img.style.width = '100%';
				img.style.height = '100%';
				img.style.objectFit = 'cover';
				content.appendChild(img);
			} else {
				content.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="gray" viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>`;
			}

			const overlay = new kakao.maps.CustomOverlay({
				position: new kakao.maps.LatLng(position.lat, position.lng),
				content,
				yAnchor: 1,
			});

			overlay.setMap(map);

			content.addEventListener('click', onClick || (() => {}));

			// CustomOverlay에도 클릭 이벤트 붙이기

			// cleanup
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
