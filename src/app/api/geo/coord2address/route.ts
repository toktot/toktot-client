export const getAddressFromLatLng = async (
	lat: number,
	lng: number,
): Promise<string | null> => {
	try {
		const res = await fetch(
			`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`,
			{
				headers: {
					Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
				},
			},
		);

		if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
		const data = await res.json();

		// 안전하게 documents[0] 접근
		const addr = data?.documents?.[0]?.address?.address_name ?? null;
		return addr;
	} catch (e) {
		console.error('위도/경도 → 주소 변환 실패', e);
		return null;
	}
};
