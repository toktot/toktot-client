'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Icon from '@/widgets/icon';

import PrimaryButton from '@/shared/components/PrimaryButton';
import TextInputWithLabel from '@/shared/components/TextInputWithLabel';
import { getKakaoLoginUrl } from '@/shared/utils/storage';
import {
	setEncryptedToken,
	setUser as storeUser,
} from '@/shared/utils/storage';

import { useAuth } from '../context/AuthProvider';

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
	const handleKakaoLogin = () => {
		const kakaoUrl = getKakaoLoginUrl();
		console.log(kakaoUrl);
		window.location.href = kakaoUrl;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (!username.trim()) {
			setError('아이디를 입력해 주세요.');
			return;
		}

		if (!password.trim()) {
			setError('비밀번호를 입력해 주세요.');
			return;
		}

		if (!validatePassword(password)) {
			setError('비밀번호 형식이 올바르지 않습니다.');
			return;
		}

		try {
			const res = await fetch('http://13.209.53.44/api/v1/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email: username, password }),
			});

			const data = await res.json();
			console.log('Login API response:', data);

			if (!data.success) {
				setError(data.message || '아이디 또는 비밀번호를 확인하세요.');
				return;
			}
			const accessToken = data.data?.access_token;
			if (!accessToken) {
				setError('서버 응답이 올바르지 않습니다.');
				return;
			}
			setEncryptedToken(accessToken);
			storeUser(data.user);

			console.log(data.user);
			login(username, password);
			router.push('/');
		} catch (err) {
			setError('서버와 연결할 수 없습니다.');
			console.log(err);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col items-center gap-4 w-full px-6 pt-[100px]"
		>
			<Icon name="Logo" size="xxl" className="w-[100px] h-auto mb-4" />
			<div className="w-full max-w-[343px]">
				<TextInputWithLabel
					label="이메일"
					value={username}
					onChange={setUsername}
					placeholder="이메일을 입력해주세요."
					inputClassName="w-[343px] h-[48px] hover:border border-primary-40 hover:text-primary-40 focus:border border-primary-40 focus:text-primary-40"
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
					inputClassName="w-[343px] h-[48px] hover:text-primary-40 hover:border border-primary-40 focus:border border-primary-40 focus:text-primary-40"
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
			<Link href="/PasswordFind">
				<button
					type="button"
					className="text-sm h-[35px] w-[180px] text-grey-90 bg-[#ffffff] border border-grey-30 rounded-[20px]"
				>
					비밀번호를 찾고 계신가요?
				</button>
			</Link>
			<button
				type="button"
				onClick={handleKakaoLogin}
				className="bg-[#FEE500] text-black w-[343px] h-[48px] rounded-[30px] font-medium"
			>
				카카오로 쉬운 시작
			</button>
			<Link href="/signup">
				<button
					type="button"
					className="text-base w-[70px] h-[24px] text-[#000000]"
				>
					회원가입
				</button>
			</Link>
		</form>
	);
}
