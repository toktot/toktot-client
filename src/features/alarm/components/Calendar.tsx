'use client';

import React, { useState } from 'react';

import dayjs from 'dayjs';

import PrimaryButton from '@/shared/components/PrimaryButton';
import Icon from '@/shared/ui/Icon';

interface CalendarProps {
	startDated: Date | null;
	endDated: Date | null;
	onChange: (start: Date | null, end: Date | null) => void;
	onClose: () => void;
}

const Calendar = ({ onChange, onClose }: CalendarProps) => {
	const [year, setYear] = useState(2025);
	const [month, setMonth] = useState(4); // 0-indexed → 4: 5월
	const [showMonthPicker, setShowMonthPicker] = useState(false);

	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);

	const daysInMonth = dayjs(new Date(year, month)).daysInMonth();

	const handleDayClick = (day: number) => {
		const clickedDate = new Date(year, month, day);
		if (!startDate) {
			setStartDate(clickedDate);
			setEndDate(null);
			onChange(clickedDate, null);
		} else if (startDate && !endDate) {
			if (clickedDate.getTime() === startDate.getTime()) {
				setStartDate(null);
				onChange(null, null);
			} else if (clickedDate > startDate) {
				setEndDate(clickedDate);
				onChange(startDate, clickedDate);
			} else {
				setStartDate(clickedDate);
				setEndDate(null);
				onChange(clickedDate, null);
			}
		} else {
			setStartDate(clickedDate);
			setEndDate(null);
		}
	};

	const getSelectedDays = () => {
		if (!startDate) return [];
		if (!endDate) return [startDate];
		const days = [];
		const current = new Date(startDate);
		while (current <= endDate) {
			days.push(new Date(current));
			current.setDate(current.getDate() + 1);
		}
		return days;
	};

	const selectedDays = getSelectedDays();

	const formatDate = (date: Date) => {
		console.log('endDate', endDate);
		if (
			dayjs(date).format('DD') === dayjs(endDate).format('DD') ||
			(!endDate && dayjs(date).format('DD') === dayjs(startDate).format('DD'))
		) {
			return dayjs(date).format('D');
		}
		return dayjs(date).format('D,');
	};

	const isStartOrEndDay = (day: number) => {
		if (!startDate) return false;
		if (
			day === startDate.getDate() &&
			month === startDate.getMonth() &&
			year === startDate.getFullYear()
		)
			return true;

		if (
			endDate &&
			day === endDate.getDate() &&
			month === endDate.getMonth() &&
			year === endDate.getFullYear()
		)
			return true;
		return false;
	};
	const isInRange = (day: number) => {
		if (!startDate || !endDate) return false;
		const current = new Date(year, month, day).getTime();
		const start = startDate.getTime();
		const end = endDate.getTime();
		return current > start && current < end;
	};

	return (
		<div className="p-4 max-w-md mx-auto bg-grey-10">
			{!showMonthPicker ? (
				<div className="flex-start-0">
					<div className="bg-white">
						{/* 상단 년/월 선택 */}
						<div
							className="flex justify-center items-center gap-1 cursor-pointer  p-2 rounded-lg w-fit mx-auto "
							onClick={() => setShowMonthPicker(true)}
						>
							<span className="font-semibold">{year}</span>
							<span>년</span>
							<span>{month + 1}</span>
							<span>월</span>
							<Icon name="ArrowDown" size="xs" className="text-grey-60" />
						</div>

						{/* 요일 헤더 */}
						<div className="grid grid-cols-7 mt-4 text-center font-semibold text-gray-600">
							{['일', '월', '화', '수', '목', '금', '토'].map((dayName) => (
								<div key={dayName} className="py-1">
									{dayName}
								</div>
							))}
						</div>

						{/* 날짜 그리드 */}
						<div className="grid grid-cols-7 gap-2 mt-1">
							{/* 이번 달 1일의 요일(0:일요일~6:토요일) 만큼 빈칸 만들기 */}
							{Array.from({
								length: dayjs(new Date(year, month, 1)).day(),
							}).map((_, i) => (
								<div key={'empty' + i} />
							))}

							{Array.from({ length: daysInMonth }, (_, i) => {
								const day = i + 1;

								const isEdge = isStartOrEndDay(day);
								const inRange = isInRange(day);
								const dayClassName = isEdge
									? 'bg-primary-40 text-white'
									: inRange
										? 'bg-primary-20 text-grey-90'
										: ' text-grey-90';

								return (
									<button
										key={day}
										onClick={() => handleDayClick(day)}
										className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${dayClassName}`}
										type="button"
									>
										{day}
									</button>
								);
							})}
						</div>
					</div>

					{/* 선택한 날짜 요약 */}
					{selectedDays.length > 0 ? (
						<div className="mt-4 text-center text-gray-700">
							<div className="flex flex-wrap gap-2">
								{selectedDays.map((date) => (
									<span
										key={date.toISOString()}
										className=" py-1 rounded bg-primary-100 text-primary-800 text-sm"
									>
										{formatDate(date)}
									</span>
								))}
								<span className="mr-">일</span>
							</div>
						</div>
					) : (
						<div className="text-[12px] text-grey-90 font-semibold mt-2">
							선택된 날짜가 없습니다.
						</div>
					)}
				</div>
			) : (
				<>
					{/* 월 선택 UI */}
					<div className="flex justify-center items-center mb-4 gap-4">
						<Icon
							name="ArrowLeft"
							className="cursor-pointer"
							onClick={() => setYear((prev) => prev - 1)}
						/>
						<span className="font-semibold text-lg">{year}년</span>
						<Icon
							name="ArrowRight"
							className="cursor-pointer"
							onClick={() => setYear((prev) => prev + 1)}
						/>
					</div>

					{/* 1~12월 선택 */}
					<div className="grid grid-cols-3 gap-4 mb-4">
						{Array.from({ length: 12 }, (_, i) => (
							<button
								key={i}
								onClick={() => {
									setMonth(i);
									setShowMonthPicker(false);
								}}
								className={`p-3 rounded-lg text-center font-semibold transition
                  ${
										i === month
											? 'bg-primary-500 text-white'
											: 'hover:bg-gray-100'
									}
                `}
								type="button"
							>
								{i + 1}월
							</button>
						))}
					</div>
				</>
			)}
			<div className="flex justify-start">
				<PrimaryButton
					text="완료"
					type="button"
					disabled={!startDate || !endDate}
					className="relative w-[343px] mt-10"
					onClick={onClose}
				/>
			</div>
		</div>
	);
};

export default Calendar;
