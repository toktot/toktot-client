'use client';

import { useState } from 'react';

import toast from 'react-hot-toast';

import { createAuthApi } from '@/shared/api';
import { ApiError } from '@/shared/api/ApiError';
import { getDecryptedToken } from '@/shared/utils/storage';

import { createBlockApi } from '../api/api';

const api = createBlockApi(
	createAuthApi({ getToken: () => getDecryptedToken() ?? undefined }),
);

export const useBlockUser = () => {
	const [isLoading, setIsLoading] = useState(false);

	const blockUser = async (userId: number) => {
		setIsLoading(true);
		try {
			await api.blockUser({ blocked_user_id: userId });
			toast.success('사용자를 차단했습니다.');
			// TODO: 차단 후 UI에서 해당 사용자 리뷰를 숨기거나, 목록을 새로고침하는 로직 추가
			return true;
		} catch (error) {
			if (error instanceof ApiError) {
				toast.error(error.message);
			} else {
				toast.error('알 수 없는 오류로 차단에 실패했습니다.');
				console.error(error);
			}
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	return { blockUser, isLoading };
};
