'use client';

import React, { useState } from 'react';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import AutocompleteList from '@/features/locationsetting/ui/AutocompleteList';

import PrimaryButton from '@/shared/components/PrimaryButton';
import SearchBox from '@/shared/components/SearchBox';
import { useCurrentLocation } from '@/shared/location/lib/useCurrentLocation';
import Icon from '@/shared/ui/Icon';

import Calendar from './Calendar';

interface TripProps {
	onClose?: () => void;
}
export default function Trip({ onClose }: TripProps) {
	const [address, setAddress] = useState('');
	const [, setSearchAddress] = useState('');
	const { location } = useCurrentLocation();
	const [showResults, setShowResults] = useState(false);
	const [showCalendar, setShowCalendar] = useState(false);

	// 여행 기간 상태
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);
	const handleSelect = (selectedAddress: string, displayText: string) => {
		setAddress(displayText);
		setSearchAddress(selectedAddress);
		setShowResults(false);
	};

	const searchParams = useSearchParams();
	const q = searchParams.get('q') ?? '';
	const [query] = useState(q);
	const router = useRouter();

	const handleCurrentLocationClick = () => {
		if (location) {
			const lat = location.coords.latitude;
			const lng = location.coords.longitude;
			const current = `(${lat.toFixed(5)}, ${lng.toFixed(5)})`;
			const text = `현재 위치: ${current}`;
			setAddress(text);
			setSearchAddress(text);
			setShowResults(false);
		}
	};

	const formatDisplayDate = (date: Date | null) => {
		if (!date) return '-';
		return date.toLocaleDateString();
	};
	const getTripDuration = () => {
		if (!startDate || !endDate) return null;
		const diffTime = endDate.getTime() - startDate.getTime();
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
		return `${diffDays},박, ${diffDays + 1},일`;
	};
	const handleConfirm = () => {
		const params = new URLSearchParams();
		if (startDate && endDate) {
			const date = `${formatDisplayDate(startDate)} ~ ${formatDisplayDate(endDate)}`;
			params.set('date', date);
		}
		if (address) params.set('address', address);
		router.push(`/alarm?q=${query}&${params.toString()}`);
		if (onClose) {
			onClose();
		}
	};
	return (
		<main className="min-h-screen bg-white p-5">
			{showCalendar ? (
				<Calendar
					startDated={startDate}
					endDated={endDate}
					onChange={(start, end) => {
						setStartDate(start);
						setEndDate(end);
						console.log('start', startDate);
						console.log('end', end);
					}}
					onClose={() => setShowCalendar(false)}
				/>
			) : (
				<div className="w-full max-w-[343px]">
					<label className="text-grey-90 font-semibold mb-">여행지 위치</label>
					<SearchBox
						query={address}
						placeholder="장소를 설정해주세요."
						onChange={(value) => {
							setAddress(value);
							setShowResults(true); // 입력 시 결과 보이게
						}}
						onSearchClick={() => {
							setSearchAddress(address);
							setShowResults(true);
						}}
						onFocus={() => setShowResults(true)}
						className="mb-3 mt-3"
					/>

					{/* 선택된 주소 표시 */}

					{/* 현재 위치 + 검색결과 리스트 */}
					{showResults && address.trim() && (
						<AutocompleteList
							query={address}
							onSelect={handleSelect}
							onCurrentLocationClick={handleCurrentLocationClick}
						/>
					)}
					<div>
						<label className="text-grey-90 font-semibold">여행 기간</label>
						{startDate && endDate && (
							<div className="mt-1 text-sm text-grey-70 font-medium">
								<span className="text-[18px] font-semibold text-grey-90">
									{getTripDuration()?.split(',')[0]}
								</span>
								<span className="text-grey-85 text-[14px]">
									{getTripDuration()?.split(',')[1]}
								</span>
								<span className="text-[18px] font-semibold text-grey-90">
									{getTripDuration()?.split(',')[2]}
								</span>
								<span className="text-grey-85 text-[14px]">
									{getTripDuration()?.split(',')[3]}
								</span>
							</div>
						)}
						<div className="relative flex items-center gap-2 mt-5">
							<button
								type="button"
								className="bg-grey-10 p-2 rounded-2xl max-w-[157px]"
								onClick={() => setShowCalendar((prev) => !prev)}
							>
								<div className="relative flex items-center gap-2 text-grey-70">
									{startDate ? `${formatDisplayDate(startDate)}` : '20NN.NN.NN'}
									<span>
										<Icon name={'Search'} size="s" className={'text-grey-50'} />
									</span>
								</div>
							</button>
							<span className="text-[#000000]">~</span>
							<button
								type="button"
								className="bg-grey-10 p-2 rounded-2xl max-w-[157px]"
							>
								<div className="relative flex items-center gap-2 text-grey-70">
									{endDate ? `${formatDisplayDate(endDate)}` : '20NN.NN.NN'}
									<Icon name={'Search'} size="s" className={'text-grey-50'} />
								</div>
							</button>
						</div>
					</div>
					<div className="flex justify-start">
						<PrimaryButton
							text="완료"
							type="button"
							disabled={!startDate || !endDate || showResults}
							onClick={handleConfirm}
							className="relative w-[343px] mt-10"
						/>
					</div>
				</div>
			)}
		</main>
	);
}
