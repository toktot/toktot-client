'use client';

import { Suspense, useEffect } from 'react';
import { useRef } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { setEncryptedToken, setUser } from '@/shared/utils/storage';

function KakaoCallbackContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const code = searchParams.get('code');
	const hasFetched = useRef(false);

	useEffect(() => {
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
			console.log('Sending code to backend:', code);
			try {
				const res = await fetch('http://13.209.53.44/api/v1/auth/kakao/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ code }),
				});

				const data = await res.json();
				console.log('Backend response:', data);

				if (res.ok && data.success) {
					console.log('Login successful. AccessToken:', data.data.accessToken);
					console.log('User info:', data.data.user);
					setEncryptedToken(data.data.accessToken);
					setUser(data.data.user);
					router.push('/dashboard');
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
