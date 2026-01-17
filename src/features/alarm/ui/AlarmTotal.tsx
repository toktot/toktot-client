'use client';

import { useState } from 'react';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Picker from 'react-mobile-picker';

import {
	BottomSheet,
	BottomSheetContent,
	BottomSheetOverlay,
} from '@/shared/components/BottomSheet';
import Icon from '@/shared/ui/Icon';

import AlarmComponent from './AlarmComponent';
import Trip from './Trip';

export default function AlarmTotal() {
	const [isOpen, setIsOpen] = useState(false);
	const [recommendOn, setRecommendOn] = useState(true);
	const handleClose = () => setIsOpen(false);
	const searchParams = useSearchParams();
	const location = searchParams.get('address');
	const date = searchParams.get('date');
	const router = useRouter();
	const handleReturn = () => {
		router.push('/alarm');
	};
	const [datePickerOpen, setDatePickerOpen] = useState(false);
	const [activePicker, setActivePicker] = useState<'start' | 'end' | null>(
		null,
	);

	const [startDate, setStartDate] = useState<string>('');
	const [endDate, setEndDate] = useState<string>('');
	const [pickerTab, setPickerTab] = useState<'store' | 'review'>('store');

	const [pickerValue, setPickerValue] = useState({
		year: new Date().getFullYear().toString(),
		month: (new Date().getMonth() + 1).toString(),
	});
	const years = Array.from({ length: 20 }, (_, i) => (2010 + i).toString());
	const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
	const handleConfirmDate = () => {
		const pickedDate = `${pickerValue.year}.${pickerValue.month.padStart(2, '0')}`;

		if (activePicker === 'start') {
			setStartDate(pickedDate);
		} else if (activePicker === 'end') {
			setEndDate(pickedDate);
		}
		setDatePickerOpen(false);
		setActivePicker(null);
	};
	const mockAlarms = [
		{
			id: 1,
			message: '농담곰4546님이 최근에 살펴본 가게와 "돈사돈"가게가 유사해요',
			createdAt: '2025.09.24',
			review: {
				id: 101,
				storeImageUrl: '',
				storeName: '제주둠베고기집',
				address: '서귀포시 노형동 · 234m',
				reviewCount: 120,
				valueScore: 4.5,
				topPercent: '상위 10%',
				mainMenus: ['돔베고기'],
				rating: 4.3,
			},
		},
	];

	return (
		<div className="bg-grey-10 min-h-screen">
			<div className="relative flex items-center justify-between w-full bg-white py-3">
				<button onClick={() => router.push('/back')}>
					<Icon
						name={'ArrowLeftBar'}
						className="text-grey-70 mx-4"
						size="xxl"
					/>
				</button>
				<span className="text-base font-semibold text-grey-90">알림</span>
				<Icon name={'Cancel'} className="text-grey-70" size="xl" />
			</div>

			<div className="w-full px-4 mt-4">
				<div className="bg-white rounded-2xl p-4 ">
					<div className="flex items-center justify-between mb-3">
						<div>
							<p className="text-grey-90 text-[15px] font-semibold">
								알림으로 가게 추천 더 많이 받기
							</p>
							<p className="text-grey-70 text-[12px]">
								기간동안 저장한 가게와 유사한 가게를 더 추천해드려요
							</p>
						</div>
						{/* 스위치 버튼 */}
						<label className="inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								checked={recommendOn}
								onChange={() => setRecommendOn(!recommendOn)}
								className="sr-only"
							/>
							<div
								className={`w-11 h-6 rounded-full relative transition-colors ${
									recommendOn ? 'bg-primary-40' : 'bg-gray-200'
								}`}
							>
								<div
									className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
										recommendOn ? 'translate-x-5' : 'translate-x-0'
									}`}
								/>
							</div>
						</label>
					</div>

					{/* 날짜 입력창 */}
					<div className="flex items-center justify-between gap-2 mt-2">
						<button
							type="button"
							disabled={!recommendOn}
							onClick={() => {
								setActivePicker('start');
								setDatePickerOpen(true);
							}}
							className={`w-full rounded-2xl px-3 py-3 text-[16px] font-bold text-left ${recommendOn ? 'bg-grey-10 text-grey-70' : 'text-grey-50 bg-grey-20 cursor-not-allowed'}`}
						>
							<div className="flex flex-wrap justify-between">
								{startDate ? startDate : recommendOn ? '입력 창' : 'nn.nn'}
								<Icon name="Calendar" />
							</div>
						</button>
						<span className={`${recommendOn ? 'text-black' : 'text-grey-50'}`}>
							~
						</span>
						<button
							type="button"
							disabled={!recommendOn}
							onClick={() => {
								setActivePicker('end');
								setDatePickerOpen(true);
							}}
							className={`w-full rounded-2xl px-3 py-3 text-[16px] font-bold text-left ${recommendOn ? 'bg-grey-10 text-grey-70' : 'bg-grey-20 text-grey-50 cursor-not-allowed'}`}
						>
							<div className="flex flex-wrap justify-between">
								{endDate ? endDate : recommendOn ? '입력 창' : 'nn.nn'}
								<Icon name="Calendar" />
							</div>
						</button>
					</div>
				</div>
			</div>
			<div
				className={`w-full px-4 mt-4 ${startDate && endDate ? 'bg-white' : 'bg-grey-10'} min-h-screen`}
			>
				{startDate && endDate ? (
					<>
						<h2 className="text-base font-semibold text-grey-90 py-4">알림</h2>
						{mockAlarms.length > 0 ? (
							<div className="flex flex-col gap-3">
								{(mockAlarms || []).map((alarm) => (
									<div
										key={alarm.id}
										className="flex gap-3 p-4 border-b border-grey-10"
									>
										<div className="flex items-center justify-between mb-2">
											<div className="flex items-center gap-2">
												<div className="mb-18 w-[44px] h-[44px] flex items-center justify-center rounded-full bg-grey-10 shrink-0">
													<Icon
														name="Star"
														className="text-primary-500 w-4 h-4"
														style={{ fill: '#40D7F5', color: '#40D7F5' }}
													/>
												</div>
												<div className="flex-1 flex flex-col gap-1">
													<div className="flex items-center justify-between">
														<span className="text-sm font-semibold text-grey-90 ml-5">
															가게 추천
														</span>
														<span className="text-xs text-grey-60">
															{alarm.createdAt}
														</span>
													</div>
													<p className="text-sm text-grey-80 mb-2 ml-5">
														{alarm.message}
													</p>
													<AlarmComponent review={alarm.review} />
												</div>
											</div>
										</div>

										{/* ✅ SimpleStore 재사용 */}
									</div>
								))}
							</div>
						) : (
							<p className="mt-6 text-grey-60 text-[16px]">
								도착한 알림이 없습니다.
							</p>
						)}
					</>
				) : (
					<p className="mt-6 text-grey-60 text-[16px]">
						도착한 알림이 없습니다.
					</p>
				)}
			</div>
			<BottomSheet open={datePickerOpen} onOpenChange={setDatePickerOpen}>
				<BottomSheetOverlay className="fixed inset-0 bg-black/50 z-40" />
				<BottomSheetContent className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl p-4 max-h-[90%]">
					{/* 탭 */}
					<div className="w-10 h-0.5 bg-grey-30 rounded-full mx-auto -mt-2" />
					<div className="flex justify-around border-b border-grey-30 mb-4">
						<button
							className={`flex-1 py-2 font-semibold ${
								pickerTab === 'store'
									? 'text-primary-500 border-b-2 border-primary-500'
									: 'text-grey-60'
							}`}
							onClick={() => setPickerTab('store')}
						>
							가게명
						</button>
						<button
							className={`flex-1 py-2 font-semibold ${
								pickerTab === 'review'
									? 'text-primary-500 border-b-2 border-primary-500'
									: 'text-grey-60'
							}`}
							onClick={() => setPickerTab('review')}
						>
							리뷰
						</button>
					</div>

					{/* Wheel Picker */}
					<div className="flex justify-center items-center gap-3 h-[150px] overflow-hidden relative">
						<Picker
							value={pickerValue}
							onChange={setPickerValue}
							height={150}
							itemHeight={40}
						>
							<Picker.Column name="year">
								{years.map((y) => (
									<Picker.Item key={y} value={y}>
										{({ selected }) => (
											<span
												className={
													selected ? 'text-primary-40 font-bold' : 'text-black'
												}
											>
												{y}
											</span>
										)}
									</Picker.Item>
								))}
							</Picker.Column>
							<Picker.Column name="yearSuffix">
								<Picker.Item value="년">
									<span className="text-black">년</span>
								</Picker.Item>
							</Picker.Column>
							<Picker.Column name="month">
								{months.map((m) => (
									<Picker.Item key={m} value={m}>
										{({ selected }) => (
											<span
												className={
													selected
														? 'text-primary-40 font-bold ml-2'
														: 'text-black'
												}
											>
												{m}
											</span>
										)}
									</Picker.Item>
								))}
							</Picker.Column>
							<Picker.Column name="monthSuffix">
								<div className="flex justify-center gap-0.5 ml-0.5 mt-2">
									{activePicker === 'start' && (
										<>
											<span className="text-black">월</span>
											<span className="text-black">부</span>
											<span className="text-black">터</span>
										</>
									)}
									{activePicker === 'end' && (
										<>
											<span className="text-black">월</span>
											<span className="text-black">까</span>
											<span className="text-black">지</span>
										</>
									)}
								</div>
							</Picker.Column>
						</Picker>

						{/* 년도 */}

						{/* 월 */}
					</div>

					{/* 선택된 값 */}
					<div className="mt-4 text-grey-90 text-[14px] font-semibold">
						{activePicker === 'start' && (
							<span>
								{pickerValue.year}.{pickerValue.month.padStart(2, '0')} ~
							</span>
						)}
						{activePicker === 'end' && (
							<span>
								{startDate} ~ {pickerValue.year}.
								{pickerValue.month.padStart(2, '0')}
							</span>
						)}
					</div>

					{/* 버튼 */}
					<button
						onClick={handleConfirmDate}
						className="mt-4 w-full py-3 rounded-full bg-grey-90 text-primary-40 font-semibold"
					>
						{activePicker === 'start'
							? '+다음'
							: activePicker === 'end'
								? '+ 확인'
								: '+ 다음'}
					</button>
					<div className="w-16 h-[2px] bg-[#000000] justify-items-center rounded-full mx-auto mt-3 bottom-3 z-50" />
				</BottomSheetContent>
			</BottomSheet>
			{/* 기존 UI */}
			{location && date ? (
				<div className=" bg-primary-10 rounded-xl w-[343px] flex justify-between items-center ml-4 p-4 my-4">
					<div className="col">
						<div className="text-grey-90 text-[16px] font-semibold mb-2">
							{location ?? '미정'}
						</div>
						<div className="text-grey-80 text-[12px]">{date ?? '미정'}</div>
					</div>
					<button
						type="button"
						className="text-primary-600 border px-4 py-1 border-grey-60 rounded-2xl font-semibold text-sm hover:underline"
						onClick={handleReturn}
					>
						수정
					</button>
				</div>
			) : (
				<BottomSheet open={isOpen} onOpenChange={setIsOpen}>
					<BottomSheetOverlay className="fixed inset-0 bg-black/50 z-40" />
					<BottomSheetContent className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl p-4 max-h-[90%] overflow-y-auto">
						<Trip onClose={handleClose} />
					</BottomSheetContent>
				</BottomSheet>
			)}
		</div>
	);
}
