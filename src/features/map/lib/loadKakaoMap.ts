export async function loadKakaoMap(): Promise<void> {
	if (window.kakao) return;

	return new Promise((resolve) => {
		const script = document.createElement('script');
		script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=clusterer,drawing`;
		script.onload = () => {
			window.kakao.maps.load(resolve);
		};
		document.head.appendChild(script);
	});
}
