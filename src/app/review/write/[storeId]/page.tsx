'use client';

import { useEffect, useState } from 'react';

import { StoreData } from '@/entities/store';
import { useParams } from 'next/navigation';

import { ReviewWriteContent } from '@/widgets/review/write/ui/ReviewWriteContent';

import api from '@/features/home/lib/api';

import { StoreId } from '@/shared/model/types';

// FIXME: 	const visitedStoreData = await getVisitedStoreData(storeId as StoreId);
export default function ReviewWritePage() {
	const params = useParams();
	const storeId = params.storeId as StoreId;

	const [visitedStoreData, setVisitedStoreData] = useState<
		(StoreData & { distance: number }) | null
	>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!storeId) return;

		const fetchStoreData = async () => {
			try {
				setIsLoading(true);
				const response = await api.get(`/v1/restaurants/${storeId}`);

				if (response.data.success) {
					const storeApiData = response.data.data;
					setVisitedStoreData({
						id: storeApiData.id,
						storeName: storeApiData.name,
						address: storeApiData.address,
						storeImageUrl: storeApiData.image || '/images/mockReview.jpg',
						mainMenu: '대표 메뉴 정보 없음', // API does not provide this
						distance: 0, // API does not provide this
					});
				} else {
					setError(response.data.message || '가게 정보를 불러오지 못했습니다.');
				}
			} catch (err) {
				setError('데이터를 불러오는 중 오류가 발생했습니다.');
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchStoreData();
	}, [storeId]);

	if (isLoading) {
		return <div className="p-4">가게 정보를 불러오는 중...</div>;
	}

	if (error) {
		return <div className="p-4">오류: {error}</div>;
	}

	if (!visitedStoreData) {
		return <div className="p-4">가게 정보를 찾을 수 없습니다.</div>;
	}

	return (
		<ReviewWriteContent storeId={storeId} visitedStoreData={visitedStoreData} />
	);
}
