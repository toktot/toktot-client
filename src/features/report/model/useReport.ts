'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { createAuthApi } from '@/shared/api';
import { ApiError } from '@/shared/api/ApiError';
import { getDecryptedToken } from '@/shared/utils/storage';

import { ReportApi, createReportApi } from '../api/api';

const API_CHECK_MAP = {
	user: (api: ReportApi, id: number) => api.checkCanReportUser(id),
	review: (api: ReportApi, id: number) => api.checkCanReportReview(id),
};

const URL_MAP = {
	user: (id: number, name: string) =>
		`/report/user/${id}?nickname=${encodeURIComponent(name)}`,
	review: (id: number) => `/report/review/${id}`,
};

const api = createReportApi(
	createAuthApi({
		getToken: () => getDecryptedToken() ?? undefined,
	}),
);

export type ReportableEntityType = keyof typeof API_CHECK_MAP;

/**
 * 신고하기 버튼의 공통 비즈니스 로직을 담당하는 훅
 * @param type 'user' 또는 'review' (자동 추론된 타입)
 * @param id 신고할 대상의 ID
 * @param nameOrSnippet 표시 및 전달에 사용할 이름 또는 내용 스니펫
 */
export const useReport = (
	type: ReportableEntityType,
	id: number,
	nameOrSnippet: string,
) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleReportClick = async () => {
		setIsLoading(true);
		try {
			const checkFunction = API_CHECK_MAP[type];
			await checkFunction(api, id);

			const url = URL_MAP[type](id, nameOrSnippet);
			router.push(url);
		} catch (error) {
			if (error instanceof ApiError) {
				toast.error(error.message);
			} else {
				toast.error('알 수 없는 오류로 신고를 진행할 수 없습니다.');
				console.error(error);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return { handleReportClick, isLoading };
};
