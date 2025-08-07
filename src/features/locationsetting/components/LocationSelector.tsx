'use client';

import { useState } from 'react';

import AutocompleteList from '@/features/locationsetting/components/AutocompleteList';
import SearchLocationMap from '@/features/locationsetting/components/SearchLocationMap';

import SearchBox from '@/shared/components/SearchBox';
import { useCurrentLocation } from '@/shared/location/lib/useCurrentLocation';
import Icon from '@/shared/ui/Icon';

import { useLocation } from './LocationContext';

interface LocationSelectorProps {
	onClose?: () => void;
}

export default function LocationSelector({ onClose }: LocationSelectorProps) {
	const [address, setAddress] = useState('');
	const [searchAddress, setSearchAddress] = useState('');
	const [step, setStep] = useState<'search' | 'confirm'>('search'); // 단계 관리
	const [isMarkerClicked, setIsMarkerClicked] = useState(false);
	const [displayName, setDisplayName] = useState('');
	const { setLocation } = useLocation();

	const { location } = useCurrentLocation();

	const handleSaveLocation = () => {
		if (!searchAddress) return;

		setLocation({
			address: displayName || address,
			lat: null,
			lng: null,
		});
		onClose?.();
	};

	const handleSelect = (selectedAddress: string, displayText: string) => {
		setAddress(displayText); // 검색창에는 보기 좋은 이름 (ex: 제주사랑 카페)
		setSearchAddress(selectedAddress); // 실제 지도 검색은 주소로 해야 하므로 address
		setDisplayName(displayText); // 필요 시 표시용으로 따로 저장
		setIsMarkerClicked(false);
	};

	const handleCurrentLocationClick = () => {
		if (location) {
			const lat = location.coords.latitude;
			const lng = location.coords.longitude;
			const current = `(${lat.toFixed(5)}, ${lng.toFixed(5)})`;
			const text = `현재 위치: ${current}`;
			setAddress(text);
			setSearchAddress(text);
			setIsMarkerClicked(false);
		}
	};

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
		<main className="min-h-screen p-6 bg-white">
			{/* 검색창 */}
			{step === 'confirm' && (
				<div className="text-center text-gray-600 mt-4">
					{isMarkerClicked ? (
						<p className="text-[16px] font-semibold text-grey-90 mb-2 mr-35">
							선택된 위치예요.
						</p>
					) : (
						<h2 className="text-[16px] font-semibold text-grey-90 mb-2 mr-30">
							현재 위치가 맞나요?
						</h2>
					)}
				</div>
			)}
			{step === 'confirm' ? (
				<div className="flex items-center justify-between bg-grey-10 px-4 py-3 rounded-2xl mt-4">
					<div className="flex items-center gap-2">
						<Icon name="Location" className="text-primary-40" />
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
						<Icon name={'Cancel'} size="s" className="text-grey-50" />
					</button>
				</div>
			) : (
				<SearchBox
					query={address}
					onChange={(val) => {
						setAddress(val);
						setStep('search');
					}}
					onSearchClick={handleSearchClick}
					placeholder="주소를 입력하세요"
				/>
			)}

			{step === 'search' && (
				<AutocompleteList
					query={address}
					onSelect={handleSelect}
					onCurrentLocationClick={handleCurrentLocationClick}
				/>
			)}

			{/* 다음 버튼 (검색 단계) */}
			{step === 'search' && (
				<div className="flex justify-center mt-6">
					<button
						className="bg-black text-white w-[343px] h-[48px] py-3 rounded-2xl font-semibold"
						onClick={goToNextStep}
					>
						다음
					</button>
				</div>
			)}

			{/* 지도 및 위치 저장 (확인 단계) */}
			{step === 'confirm' && (
				<>
					<div className="mt-4">
						<SearchLocationMap
							address={searchAddress}
							onMarkerClick={() => setIsMarkerClicked(true)}
						/>
					</div>

					<div className="flex justify-center mt-6">
						<button
							disabled={!isMarkerClicked}
							onClick={handleSaveLocation}
							className="w-full py-3 rounded-2xl font-semibold transition-all bg-black text-primary-40"
						>
							위치 저장
						</button>
					</div>
				</>
			)}
		</main>
	);
}
