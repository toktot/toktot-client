'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import PrimaryButton from '@/shared/components/PrimaryButton';
import TextInputWithLabel from '@/shared/components/TextInputWithLabel';
import {
	setEncryptedToken,
	setUser as storeUser,
} from '@/shared/utils/storage';

import { useAuth } from '../context/AuthProvider';

interface KakaoAuthResponse {
	access_token: string;
	refresh_token: string;
	scope: string;
	token_type: string;
	expires_in: number;
	refresh_token_expires_in: number;
}

interface KakaoUserResponse {
	id: number;
	properties: {
		nickname: string;
	};
	kakao_account: {
		email?: string;
	};
}

declare global {
	interface Window {
		Kakao: {
			init: (key: string) => void;
			isInitialized: () => boolean;
			Auth: {
				login: (options: {
					scope: string;
					success: (authObj: KakaoAuthResponse) => void;
					fail: (err: unknown) => void;
				}) => void;
			};
			API: {
				request: (options: {
					url: string;
					success: (res: KakaoUserResponse) => void;
					fail: (err: unknown) => void;
				}) => void;
			};
		};
	}
}

export default function LoginForm() {
	const { login } = useAuth();
	const router = useRouter();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const validatePassword = (pwd: string) => {
		const regex =
			/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':",.<>?\\|`~\-=/]).{8,20}$/;
		return regex.test(pwd);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (username.trim() === '') {
			setError('아이디를 입력해 주세요.');
			return;
		}

		if (password.trim() === '') {
			setError('비밀번호를 입력해 주세요.');
			return;
		}

		if (!validatePassword(password)) {
			setError('비밀번호 형식이 올바르지 않습니다.');
			return;
		}

		const success = login(username, password);
		if (success) {
			router.push('/dashboard');
		} else {
			setError('아이디 또는 비밀번호를 잘못 입력하였습니다.');
		}
	};

	const handleKakaoLogin = () => {
		if (typeof window === 'undefined' || !window.Kakao) return;

		const Kakao = window.Kakao;

		if (!Kakao.isInitialized()) {
			Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY || '');
		}

		Kakao.Auth.login({
			scope: 'profile_nickname',
			success: function (authObj) {
				Kakao.API.request({
					url: '/v2/user/me',
					success: function (res) {
						const kakaoUser = {
							id: res.id,
							username: `kakao_${res.id}`,
							name: res.properties.nickname,
							password: '',
						};

						setEncryptedToken(authObj.access_token);
						storeUser(kakaoUser);
						login(kakaoUser.username, '');
						router.push('/dashboard');
					},
					fail: function (error) {
						console.error('카카오 유저 정보 요청 실패', error);
						setError('카카오 사용자 정보 요청에 실패했습니다.');
					},
				});
			},
			fail: function (err) {
				console.error('카카오 로그인 실패', err);
				setError('카카오 로그인에 실패했습니다.');
			},
		});
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col items-center gap-4 w-full px-6 pt-[100px]"
		>
			<div className="w-full max-w-[343px]">
				<TextInputWithLabel
					label="이메일"
					value={username}
					onChange={setUsername}
					placeholder="이메일을 입력해주세요."
					inputClassName="w-[343px] h-[48px]"
					labelClassName="text-grey-90"
				/>
			</div>

			<div className="w-full max-w-[343px] mt-[20px]">
				<TextInputWithLabel
					label="비밀번호"
					value={password}
					onChange={setPassword}
					placeholder="비밀번호를 입력하세요."
					type="password"
					inputClassName="w-[343px] h-[48px]"
					labelClassName="text-grey-90"
				/>

				{error && <p className="text-red-500 text-sm mt-1 pl-2">{error}</p>}
			</div>

			<div className="w-full max-w-[343px] mt-[20px]">
				<PrimaryButton
					type="submit"
					text="로그인"
					className="w-[343px]"
					disabled={username.trim() === '' || password.trim() === ''}
					bgColorWhenEnabled="bg-grey-90"
					textColorWhenEnabled="text-primary-60"
				/>
			</div>

			<button
				type="button"
				className="text-sm h-[18px] text-grey-90"
				onClick={() => alert('비밀번호 찾기 페이지로 연결')}
			>
				비밀번호 찾기
			</button>

			<button
				type="button"
				onClick={handleKakaoLogin}
				className="bg-[#FEE500] text-black w-[343px] h-[48px] rounded-[12px] font-medium"
			>
				카카오로 쉬운 시작
			</button>

			<button
				type="button"
				className="text-sm w-[55px] h-[24px] text-grey-70"
				onClick={() => alert('회원가입 페이지로 이동')}
			>
				회원가입
			</button>
		</form>
	);
}
