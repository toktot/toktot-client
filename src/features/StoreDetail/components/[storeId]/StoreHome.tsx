'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { mockHome } from '@/features/home/model/mockHome';
import { useMap } from '@/features/map/model/useMap';

import Icon from '@/shared/ui/Icon';

import { CopyButton } from '../Copy';

export default function StoreHome() {
	const params = useParams();
	const storeId = Number(params.storeId);

	// 가게 데이터 찾기
	const store = mockHome.find((review) => review.id === storeId);
	useMap('map', { center: store?.position });

	if (!store) return <div>가게 정보를 찾을 수 없습니다.</div>;

	// 지도 초기화 (store.location으로 중심 설정)
	// 기본 좌표가 필요하니 실제 앱에서는 store.location을 주소 → 좌표 변환해야 함 (geocoding)
	// 지금은 예제로 DEFAULT_CENTER 사용

	const kakaoRouteUrl = `https://map.kakao.com/link/to/${encodeURIComponent(
		store.placeName,
	)},${store.position?.lat},${store.position?.lng}`;

	return (
		<div className="bg-grey-10 flex justify-center pt-4 pb-8 px-4 mx-auto">
			<div className="bg-white rounded-3xl shadow mt-4 w-full max-w-md flex flex-col">
				<div className="flex justify-start px-2">
					<span className="text-[18px] font-semibold text-black mb-2 ml-2 mt-2">
						오는 길
					</span>
				</div>
				<div
					id="map"
					className="h-48 w-[311px] flex items-center rounded-2xl mb-4 ml-4"
				/>
				<div className="flex items-center mb-2 px-4">
					<Icon name={'Location'} className="mr-2 w-5 h-5 text-grey-50" />
					<span className="text-grey-80 text-base text-[12px]">
						{store.location}
					</span>
					<CopyButton text={store.location} />
				</div>
				<div className="ml-4">
					<Link
						href={kakaoRouteUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="mb-4 gap-2 inline-flex justify-center items-center py-3 w-[303px] border border-grey-50 text-black text-base font-bold rounded-3xl"
					>
						길찾기
					</Link>
				</div>
			</div>
		</div>
	);
}
