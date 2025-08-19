'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { createAuthApi } from '@/shared/api';
import { ApiError } from '@/shared/api/ApiError';
import { getDecryptedToken } from '@/shared/utils/storage';

import { createReportApi } from '../api/api';

/**
 * 사용자 신고 버튼의 비즈니스 로직을 담당하는 훅
 * @param userId 신고할 사용자의 ID
 * @param nickname 신고할 사용자의 닉네임 (페이지 이동 시 전달용)
 */
export const useReportUser = (userId: number, nickname: string) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const api = createReportApi(
		createAuthApi({
			getToken: () => getDecryptedToken() ?? undefined,
		}),
	);

	const handleReportClick = async () => {
		setIsLoading(true);
		try {
			await api.checkCanReport(userId);
			router.push(
				`/report/user/${userId}?nickname=${encodeURIComponent(nickname)}`,
			);
		} catch (error) {
			if (error instanceof ApiError) {
				alert(error.message);
			} else {
				alert('알 수 없는 오류로 신고를 진행할 수 없습니다.');
				console.error(error);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return { handleReportClick, isLoading };
};
