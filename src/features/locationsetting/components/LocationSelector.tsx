'use client';

import { useEffect, useState } from 'react';

import { getAddressFromLatLng } from '@/entities/location/lib/geo';
import { MOCK_LOCATIONS } from '@/entities/location/model/mockLocation';

import AutocompleteList from '@/features/locationsetting/components/AutocompleteList';
import SearchLocationMap from '@/features/locationsetting/components/SearchLocationMap';

import { BottomSheetContent } from '@/shared/components/BottomSheet';
import SearchBox from '@/shared/components/SearchBox';
import { useCurrentLocation } from '@/shared/location/lib/useCurrentLocation';
import Icon from '@/shared/ui/Icon';

import { useLocation } from './LocationContext';

interface LocationSelectorProps {
	onClose?: () => void;
	onLocationSaved?: () => void;
	user?: string | null;
}

export default function LocationSelector({
	onClose,
	onLocationSaved,
	user,
}: LocationSelectorProps) {
	const [address, setAddress] = useState('');
	const [searchAddress, setSearchAddress] = useState('');
	const [step, setStep] = useState<'search' | 'confirm'>('search'); // 단계 관리
	const [isMarkerClicked, setIsMarkerClicked] = useState(false);
	const [displayName, setDisplayName] = useState('');
	const { setLocation } = useLocation();
	const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(
		null,
	);

	const { location } = useCurrentLocation();
	const JEJU_LOCATIONS = MOCK_LOCATIONS.filter((loc) =>
		loc.address.includes('제주'),
	);
	//API 연동했을 때

	const handleSaveLocation = () => {
		if (!searchAddress || !JEJU_LOCATIONS) return;

		setLocation({
			address: displayName || address,
			lat: null,
			lng: null,
		});
		onLocationSaved?.();
		onClose?.();
	};
	const [isSelected, setIsSelected] = useState(false);
	const handleSelect = (selectedAddress: string, displayText: string) => {
		setAddress(displayText); // 검색창에는 보기 좋은 이름 (ex: 제주사랑 카페)
		setSearchAddress(selectedAddress); // 실제 지도 검색은 주소로 해야 하므로 address
		setDisplayName(displayText); // 필요 시 표시용으로 따로 저장
		setIsMarkerClicked(false);
		setIsSelected(true);
	};

	const handleCurrentLocationClick = async () => {
		if (!location) return;
		const lat = location.coords.latitude;
		const lng = location.coords.longitude;

		const addr = await getAddressFromLatLng(lat, lng);
		if (!addr || !addr.includes('제주')) {
			return;
		}
		setLatLng({ lat, lng });
		setAddress(addr);
		setSearchAddress(addr);
		setDisplayName(addr);

		setAddress(`(${lat.toFixed(5)}, ${lng.toFixed(5)})`);
	};
	useEffect(() => {
		if (!latLng) return;

		const fetchAddress = async () => {
			const addr = await getAddressFromLatLng(latLng.lat, latLng.lng);
			if (addr) {
				setAddress(addr);
				setSearchAddress(addr);
				setDisplayName(addr);
			} else {
				setAddress(`(${latLng.lat.toFixed(5)}, ${latLng.lng.toFixed(5)})`);
			}
		};

		fetchAddress();
	}, [latLng]);

	const handleSearchClick = () => {
		setSearchAddress(address);
		setIsMarkerClicked(false);
	};

	const goToNextStep = () => {
		if (address.trim()) {
			setStep('confirm');
		}
	};

	return (
		// ...생략
		<>
			<BottomSheetContent
				className={`fixed bottom-0 min-w-[375px] max-w-[480px] w-full left-1/2 z-50 bg-white rounded-t-2xl flex flex-col py-4 overflow-y-auto cursor-pointer
          ${address.trim() ? 'translate-y-50' : 'translate-y-70'} -translate-x-1/2 transition-transform duration-300 ease-in-out'}`}
				style={{
					paddingLeft: 0,
					paddingRight: 0,
					maxHeight: '150vh',
				}}
			>
				<div className="w-6 h-[0.8px] bg-[#000000] rounded-full mx-auto" />
				<main className="flex-1 overflow-y-auto min-h-screen py-6 bg-white">
					{/* 검색창 */}
					{step === 'confirm' && (
						<>
							<div className="text-grey-90 ">
								{isMarkerClicked ? (
									<p className="text-[16px] px-4 mb-2 font-semibold text-grey-90">
										선택된 위치예요.
									</p>
								) : (
									<h2 className="text-[16px] px-4 mb-2 font-semibold text-grey-90">
										현재 위치가 맞나요?
									</h2>
								)}
							</div>
							<div className="flex justify-center">
								<div className="flex justify-between bg-grey-10 px-4 py-3 mb-4 w-full rounded-2xl h-[44px] min-w-[343px] max-w-[440px]">
									<div className="flex items-center gap-2">
										<Icon
											name="Location"
											className="text-primary-40"
											size="s"
										/>
										<span className="text-[14px] text-grey-90 font-semibold">
											{address}
										</span>
									</div>
									<button
										onClick={() => {
											setAddress('');
											setSearchAddress('');
											setStep('search');
										}}
									>
										<Icon
											name={'Cancel'}
											size="m"
											className="text-grey-50 cursor-pointer"
										/>
									</button>
								</div>
							</div>
							<div className="w-full">
								<SearchLocationMap
									address={searchAddress}
									lat={latLng?.lat}
									lng={latLng?.lng}
									onMarkerClick={() => setIsMarkerClicked(true)}
									isMarkerClicked={isMarkerClicked}
									user={user}
								/>
							</div>

							<div className="flex justify-center mt-6 ">
								<button
									disabled={!isMarkerClicked}
									onClick={handleSaveLocation}
									className=" min-w-[343px] cursor-pointer max-w-[450px] w-full py-3 rounded-2xl font-semibold transition-all bg-black text-primary-40"
								>
									위치 저장
								</button>
							</div>
							<div className="w-16 h-[0.9px] bg-[#000000] rounded-full mx-auto mt-3 bottom-3 z-50" />
						</>
					)}
					{step === 'search' && (
						<>
							<div className="flex justify-center ml-2">
								<SearchBox
									query={address}
									onChange={(val) => {
										setAddress(val);
										setStep('search');
										setIsSelected(false);
									}}
									onSearchClick={handleSearchClick}
									placeholder="주소를 입력하세요"
									placeholderColor="placeholder-grey-80"
									leftIcon={
										address.trim() ? undefined : (
											<Icon name="Search" size="s" className="cursor-pointer" />
										)
									}
									rightIcon={
										address.trim() ? (
											<Icon
												name="Search"
												size="s"
												className="text-grey-50 cursor-pointer"
											/>
										) : undefined
									}
									className={`w-full min-w-[343px] max-w-[450px] h-[43px] flex items-center bg-grey-10 text-[14px] ${address.trim() ? 'border border-primary-40 text-primary-40' : ''}`}
								/>
							</div>
							<div className="flex-1 overflow-y-auto mt-4 max-h-[60vh] min-w-[375px] max-w-[480px] w-full">
								<AutocompleteList
									query={address}
									onSelect={handleSelect}
									onCurrentLocationClick={handleCurrentLocationClick}
								/>
							</div>
							<div className=" relative bottom-3 mx-auto min-w-[343px] max-w-[450px] w-full z-50">
								<div className="flex justify-center ml-2">
									<button
										disabled={!isSelected}
										className={`bg-black text-white w-full h-[46px] py-3 rounded-2xl font-semibold cursor-pointer
							${!isSelected ? 'bg-grey-40 text-primary-40 cursor-not-allowed' : 'bg-primary-90 text-primary-40'}`}
										onClick={goToNextStep}
									>
										다음
									</button>
								</div>

								<div className="w-16 h-[0.9px] bg-[#000000] rounded-full mx-auto mt-3 bottom-3 z-50" />
							</div>
						</>
					)}
				</main>
			</BottomSheetContent>
		</>
	);
}
