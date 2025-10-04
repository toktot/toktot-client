'use client';

import { useEffect, useState } from 'react';

import { createFolderApi, FolderClient } from '@/entities/review-folder/api/folder';
import { createAuthApi } from '@/shared/api';
import { getDecryptedToken } from '@/shared/utils/storage';

const api = createFolderApi(
	createAuthApi({ getToken: () => getDecryptedToken() ?? undefined }),
);

export const useUserFolders = (userId: number) => {
	const [folders, setFolders] = useState<FolderClient[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!userId) {
			setIsLoading(false);
			return;
		}

		const fetchFolders = async () => {
			try {
				setIsLoading(true);
				setError(null);
				const data = await api.getUserFolders(userId);
				setFolders(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : '폴더 조회 중 오류 발생');
			} finally {
				setIsLoading(false);
			}
		};

		fetchFolders();
	}, [userId]);

	return { folders, isLoading, error };
};
