export async function loadKakaoMap(): Promise<void> {
	if (typeof window === 'undefined') return;
	if (window.kakao && window.kakao.maps) {
		return Promise.resolve();
	}

	return new Promise((resolve) => {
		const script = document.createElement('script');
		script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services,clusterer,drawing`;
		script.onload = () => {
			window.kakao.maps.load(resolve);
		};
		document.head.appendChild(script);
	});
}
