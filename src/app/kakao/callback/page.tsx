// app/kakao/callback/page.tsx
'use client';

import { useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { setEncryptedToken, setUser } from '@/shared/utils/storage';

// app/kakao/callback/page.tsx

// app/kakao/callback/page.tsx

export default function KakaoCallbackPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const code = searchParams.get('code');

	useEffect(() => {
		if (!code) return;

		const loginWithKakao = async () => {
			try {
				const res = await fetch('http://13.209.53.44/api/v1/auth/kakao/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ code }),
				});

				const data = await res.json();

				if (res.ok && data.success) {
					setEncryptedToken(data.data.accessToken);
					setUser(data.data.user);
					router.push('/dashboard');
				} else {
					alert(data.message || '카카오 로그인 실패');
					router.push('/login');
				}
			} catch (e) {
				console.error(e);
				alert('로그인 중 오류 발생');
				router.push('/login');
			}
		};

		loginWithKakao();
	}, [code]);

	return <p className="p-4">카카오 로그인 처리 중입니다...</p>;
}
