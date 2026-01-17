import { HttpResponse, http } from 'msw';

export const handlers = [
	// --- Auth Handlers ---
	http.post('https://api.toktot.site/v1/auth/login', async ({ request }) => {
		const body = (await request.json()) as Record<string, string>;
		const { email, password } = body;
		console.log('[MSW] Login Request:', { email, password });

		if (email === 'test@example.com' && password === 'password123!') {
			return HttpResponse.json({
				success: true,
				data: {
					access_token: 'mock-access-token',
					refresh_token: 'mock-refresh-token',
				},
			});
		}
		return HttpResponse.json(
			{
				success: false,
				message: 'Invalid credentials',
				errorCode: 'USER_NOT_FOUND',
			},
			{ status: 400 },
		);
	}),

	http.get('https://api.toktot.site/v1/users/me', () => {
		return HttpResponse.json({
			success: true,
			data: {
				id: 1,
				email: 'test@example.com',
				nickname: 'MockUser',
				profileImage: 'https://via.placeholder.com/150',
			},
		});
	}),

	http.post('https://api.toktot.site/v1/auth/email/send', async () => {
		console.log('[MSW] Email Verification Sent');
		return HttpResponse.json({
			success: true,
			message: '인증 메일이 전송되었습니다.',
		});
	}),

	http.post(
		'https://api.toktot.site/v1/auth/email/verify',
		async ({ request }) => {
			const body = (await request.json()) as Record<string, string>;
			console.log('[MSW] Email Verify:', body);
			if (body.verification_code === '123456') {
				return HttpResponse.json({ success: true, message: '인증 성공' });
			}
			return HttpResponse.json(
				{ success: false, message: '인증 실패' },
				{ status: 400 },
			);
		},
	),

	// --- Store Handlers ---
	http.get('https://api.toktot.site/v1/restaurants/:storeId', ({ params }) => {
		const { storeId } = params;
		return HttpResponse.json({
			success: true,
			data: {
				id: Number(storeId),
				name: '제주 맛집 톡톡',
				address: '제주특별자치도 제주시 첨단로 242',
				phone: '064-123-4567',
				latitude: 33.450701,
				longitude: 126.570667,
				parkplace: '전용 주차장 보유',
			},
		});
	}),

	http.get('https://api.toktot.site/v1/restaurants/:storeId/menus', () => {
		return HttpResponse.json({
			success: true,
			data: [
				{
					menuId: 1,
					menuName: '흑돼지 오겹살',
					category: '메인',
					price: 18000,
					servingSize: 1,
					isMain: true,
				},
				{
					menuId: 2,
					menuName: '김치찌개',
					category: '식사',
					price: 8000,
					servingSize: 1,
					isMain: false,
				},
			],
		});
	}),

	http.get('https://api.toktot.site/v1/restaurants/:storeId/reviews', () => {
		// url에서 sort params 확인 가능
		return HttpResponse.json({
			success: true,
			data: {
				content: [
					{
						id: 101,
						author: {
							id: 1,
							nickname: '맛집탐방러',
							profileImageUrl: 'https://via.placeholder.com/50',
							reviewCount: 15,
							averageRating: 4.5,
						},
						reviewRating: 5,
						images: [],
						mealTime: 'DINNER',
						createdAt: '2024-03-15',
						satisfactionScore: 90,
						keywords: ['맛있어요', '친절해요'],
						isBookmarked: false,
						isWriter: false,
					},
				],
			},
		});
	}),

	// --- Statistics Handler (Assuming path based on typical REST patterns, verify with actual file if needed) ---
	// If the file content shows a different path, I will update it in a subsequent step.
	// Based on `reviewStatisticsApi.getReviewStatistics(storeId)`, standard REST would be:
	http.get('https://api.toktot.site/v1/restaurants/:storeId/statistics', () => {
		return HttpResponse.json({
			success: true,
			data: {
				totalReviewCount: 120,
				overallRating: 4.8,
				tooltipRatings: {
					foodRating: 4.9,
					cleanRating: 4.7,
					serviceRating: 4.8,
				},
				satisfactionDistribution: {
					highRange: 80,
					midRange: 15,
					lowRange: 5,
				},
			},
		});
	}),
];
