import { Tm128GeoJSON } from '../model/types';

export async function fetchGeojson(): Promise<Tm128GeoJSON> {
	const res = await fetch('/data/JEJU_TM128.json');
	if (!res.ok) throw new Error('행정구역 데이터를 불러오지 못했습니다.');
	return res.json();
}
