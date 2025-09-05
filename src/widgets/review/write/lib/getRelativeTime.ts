/**
 * React 컴포넌트에서 사용할 수 있는 훅
 * 1분마다 자동으로 업데이트됩니다
 */
import { useEffect, useState } from 'react';

// 상대적 날짜를 표시하는 유틸리티 함수들

/**
 * 현재 날짜 기준으로 상대적 시간을 반환합니다
 * @param date - 비교할 날짜 (Date 객체 또는 ISO 문자열)
 * @returns 상대적 시간 문자열 (예: "3일 전", "방금 전", "1시간 전")
 */
export const getRelativeTime = (date: Date | string): string => {
	const now = new Date();
	const targetDate = typeof date === 'string' ? new Date(date) : date;

	const diffInMs = now.getTime() - targetDate.getTime();
	const diffInSeconds = Math.floor(diffInMs / 1000);
	const diffInMinutes = Math.floor(diffInSeconds / 60);
	const diffInHours = Math.floor(diffInMinutes / 60);
	const diffInDays = Math.floor(diffInHours / 24);
	const diffInMonths = Math.floor(diffInDays / 30);
	const diffInYears = Math.floor(diffInDays / 365);

	// 미래 날짜인 경우
	if (diffInMs < 0) {
		return '방금 전';
	}

	// 1분 미만
	if (diffInSeconds < 60) {
		return '방금 전';
	}

	// 1시간 미만
	if (diffInMinutes < 60) {
		return `${diffInMinutes}분 전`;
	}

	// 24시간 미만
	if (diffInHours < 24) {
		return `${diffInHours}시간 전`;
	}

	// 30일 미만
	if (diffInDays < 30) {
		return `${diffInDays}일 전`;
	}

	// 12개월 미만
	if (diffInMonths < 12) {
		return `${diffInMonths}개월 전`;
	}

	// 1년 이상
	return `${diffInYears}년 전`;
};

export const useRelativeTime = (date: Date | string) => {
	const [relativeTime, setRelativeTime] = useState(() => getRelativeTime(date));

	useEffect(() => {
		const updateTime = () => {
			setRelativeTime(getRelativeTime(date));
		};

		// 1분마다 업데이트
		const interval = setInterval(updateTime, 60000);

		return () => clearInterval(interval);
	}, [date]);

	return relativeTime;
};

// 사용 예시:
// 1. 기본 사용법
// <div>{getRelativeTime(review.createdAt)}</div>

// 2. 훅 사용법 (실시간 업데이트)
// const relativeTime = useRelativeTime(review.createdAt);
// <div>{relativeTime}</div>

// 3. 간단한 "n일 전" 형식
// <div>{getDaysAgo(review.createdAt)}</div>
