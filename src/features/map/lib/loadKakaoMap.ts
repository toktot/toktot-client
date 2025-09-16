export async function loadKakaoMap(): Promise<void> {
	if (typeof window === 'undefined') {
		console.log('[KakaoMap] window is undefined');
		return;
	}
	if (window.kakao && window.kakao.maps) {
		console.log('[KakaoMap] kakao.maps already loaded');
		return Promise.resolve();
	}

	return new Promise((resolve) => {
		console.log('[KakaoMap] loading Kakao Maps SDK...');
		const script = document.createElement('script');
		script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services,clusterer,drawing`;
		script.onload = () => {
			console.log('[KakaoMap] SDK loaded, calling kakao.maps.load...');
			if (window.kakao && window.kakao.maps) {
				window.kakao.maps.load(() => {
					console.log('[KakaoMap] kakao.maps.load callback executed');
					resolve();
				});
			} else {
				console.error('[KakaoMap] kakao.maps not found after script load');
			}
		};
		document.head.appendChild(script);
	});
}
