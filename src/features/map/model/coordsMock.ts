import type { Coordinates } from '@/shared/location/model/types';

type PlaceMeta = {
	id: string;
	name: string;
	position: Coordinates;
};

export const SEOUL_TOUR_SPOTS: PlaceMeta[] = [
	{
		id: 'gyeongbokgung',
		name: '경복궁',
		position: { lat: 37.579617, lng: 126.977041 },
	},
	{
		id: 'bukchon',
		name: '북촌한옥마을',
		position: { lat: 37.582604, lng: 126.983998 },
	},
	{
		id: 'insadong',
		name: '인사동',
		position: { lat: 37.574017, lng: 126.984979 },
	},
	{
		id: 'namsan',
		name: '남산서울타워',
		position: { lat: 37.551169, lng: 126.988227 },
	},
	{
		id: 'dongdaemun',
		name: '동대문디자인플라자',
		position: { lat: 37.566479, lng: 127.009369 },
	},
	{
		id: 'myeongdong',
		name: '명동거리',
		position: { lat: 37.563757, lng: 126.985191 },
	},
	{
		id: 'cheonggyecheon',
		name: '청계천',
		position: { lat: 37.570377, lng: 126.991125 },
	},
	{
		id: 'hanriver',
		name: '한강공원 여의도',
		position: { lat: 37.527061, lng: 126.932617 },
	},
	{
		id: 'lotteworld',
		name: '롯데월드',
		position: { lat: 37.511023, lng: 127.098149 },
	},
	{
		id: 'coex',
		name: '코엑스몰',
		position: { lat: 37.511225, lng: 127.059708 },
	},
];
