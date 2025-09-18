'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { AppShell } from '@/widgets/layout';

import { useMap } from '@/features/map/model/useMap';

import {
	BottomSheet,
	BottomSheetContent,
} from '@/shared/components/BottomSheet';
import PrimaryButton from '@/shared/components/PrimaryButton';
import Icon from '@/shared/ui/Icon';
import { getDecryptedToken } from '@/shared/utils/storage';

import { CopyButton } from '../Copy';

interface StoreData {
	id: number;
	name: string;
	address: string;
	phone?: string;
	latitude?: number;
	longitude?: number;
	parkplace?: string;
}

export default function StoreHome() {
	const params = useParams();
	const storeId = params.storeId;

	// 가게 데이터 찾기
	const [store, setStore] = useState<StoreData | null>(null);

	const [selected, setSelected] = useState(false);

	useEffect(() => {
		const fetchStore = async () => {
			const token = getDecryptedToken();
			try {
				const res = await fetch(
					`https://api.toktot.site/v1/restaurants/${storeId}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							'Content-Type': 'application/json',
						},
					},
				);
				const json = await res.json();
				if (json.success && json.data) {
					const data = json.data;
					setStore({
						id: data.id,
						name: data.name,
						address: data.address,
						phone: data.phone ?? '',
						latitude: data.latitude,
						longitude: data.longitude,
						parkplace: '',
					});
				} else {
					console.error(json);
					setStore(null);
				}
			} catch (err) {
				console.log(err);
				setStore(null);
			}
		};
		fetchStore();
	}, [storeId]);

	useMap('map', {
		center: store ? { lat: store.latitude!, lng: store.longitude! } : undefined,
	});

	// 지도 초기화 (store.location으로 중심 설정)
	// 기본 좌표가 필요하니 실제 앱에서는 store.location을 주소 → 좌표 변환해야 함 (geocoding)
	// 지금은 예제로 DEFAULT_CENTER 사용
	if (!store) return <div>가게 정보를 찾을 수 없습니다.</div>;
	const kakaoRouteUrl = `https://map.kakao.com/link/to/${encodeURIComponent(
		store.name,
	)},${store.latitude},${store.longitude}`;

	return (
		<AppShell showBottomNav={true}>
			<div className="bg-grey-10 flex justify-center px-4 ">
				<div className="bg-white rounded-3xl w-full max-w-[410px] min-w-[310px] mt-5 flex flex-col">
					<>
						<div className="flex justify-start px-2">
							<span className="text-[18px] font-semibold text-black mb-2 ml-2 mt-2">
								오는 길
							</span>
						</div>
						<div
							id="map"
							className="h-48 sm:w-[380px] w-[310px] rounded-2xl mb-4 ml-4"
						/>
						<div className="flex items-center mb-2 px-4">
							<Icon name={'Location'} className="mr-2 w-5 h-5 text-grey-50" />
							<span className="text-grey-85 text-[12px]">{store.address}</span>
							<span className="text-grey-60 text-[12px]">
								<CopyButton text={store.address} />
							</span>
						</div>
						<div className="ml-4" onClick={() => setSelected(true)}>
							<button className="cursor-pointer mb-4 gap-2 w-[310px] sm:w-[380px] inline-flex justify-center items-center py-3 border border-grey-50 text-black text-base font-bold rounded-3xl">
								길찾기
							</button>
						</div>
					</>
					{selected && (
						<BottomSheet open>
							<BottomSheetContent className="fixed bottom-0 z-50 bg-white rounded-t-3xl w-[310px] sm:w-[400px] left-1/2 transform -translate-x-1/2 overflow-hidden cursor-pointer">
								<div className="w-5 h-[2px] bg-grey-70 rounded-full mx-auto mt-3" />
								<div className="flex justify-start px-2">
									<span className="text-[18px] font-semibold text-black mb-2 ml-2 mt-2">
										길찾기
									</span>
								</div>
								<div className="flex flex-col rounded-2xl items-center justify gap-2 overflow-y-auto">
									<Link
										href={kakaoRouteUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="gap-2 flex flex-col justify-start items-start px-4 py-2 w-[310px] sm:w-[380px] border border-grey-20  text-base font-bold rounded-xl"
									>
										매장으로 가기
										<span className="text-[12px] text-grey-80 font-medium">
											{store.address}
										</span>
									</Link>

									<button className="gap-2 flex flex-col w-[310px] sm:w-[380px] justify-start px-4 py-2 items-start border border-grey-20 rounded-xl font-bold">
										주차하러 가기
										<span className="text-[12px] text-grey-80 font-medium">
											{store.parkplace}
										</span>
									</button>
									<PrimaryButton
										text="닫기"
										onClick={() => setSelected(false)}
										className="w-[310px] sm:w-[380px] h-[48px] bg-grey-90 text-white mt-5 cursor-pointer"
									></PrimaryButton>
									<div className="w-16 h-[1.5px] bg-[#000000] rounded-full mx-auto z-50" />
									<div className="flex flex-col rounded-2xl items-center justify gap-2 overflow-y-auto mt-2"></div>
								</div>
							</BottomSheetContent>
						</BottomSheet>
					)}
				</div>
			</div>
		</AppShell>
	);
}
