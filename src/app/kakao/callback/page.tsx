'use client';

import { Suspense, useEffect, useRef } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { setEncryptedToken, setUser } from '@/shared/utils/storage';

function KakaoCallbackContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const code = searchParams.get('code');
	const hasFetched = useRef(false);

	useEffect(() => {
		console.log(code);
		if (!code) {
			console.warn('No Kakao code found in URL');
			return;
		}
		if (hasFetched.current) {
			console.log('Already fetched, skipping duplicate call');
			return;
		}
		hasFetched.current = true;

		const loginWithKakao = async () => {
			try {
				const res = await fetch('https://api.toktot.site/v1/auth/kakao/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ code }),
				});

				const data = await res.json();

				if (res.ok && data.success) {
					const token = data.data.access_token; // snake_case로 변경
					const user = data.data.user;

					console.log('Login successful. AccessToken:', token);
					setEncryptedToken(token);
					setUser(user);
					router.push('/home');
				} else {
					console.error('Login failed:', data.message);
					alert(data.message || '카카오 로그인 실패');
					router.push('/login');
				}
			} catch (e) {
				console.error('Fetch error:', e);
				alert('로그인 중 오류 발생');
				router.push('/login');
			}
		};

		loginWithKakao();
	}, [code, router]);

	return <p className="p-4">카카오 로그인 처리 중입니다...</p>;
}

export default function KakaoCallbackPage() {
	return (
		<Suspense fallback={<p className="p-4">카카오 로그인 처리 중입니다...</p>}>
			<KakaoCallbackContent />
		</Suspense>
	);
}
