'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import PrimaryButton from '@/shared/components/PrimaryButton';
import TextInputWithLabel from '@/shared/components/TextInputWithLabel';
import Icon from '@/shared/ui/Icon';
import { getKakaoLoginUrl } from '@/shared/utils/storage';

import { useAuth } from '@/features/auth/context/AuthProvider';

export default function LoginForm() {
	const { login } = useAuth();
	const router = useRouter();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
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
		setEmailError('');
    setPasswordError('');

		console.log({ username, password });

		if (!username.trim()) {
			setEmailError('아이디를 입력해 주세요.');
			return;
		}

		if (!password.trim()) {
			setPasswordError('비밀번호를 입력해 주세요.');
			return;
		}

		if (!validatePassword(password)) {
			setPasswordError('비밀번호 형식이 올바르지 않습니다.');
			return;
		}

		const result = await login(username, password); // 여기만 호출
		console.log('result.success', result.success);

		if (result.success) {
			router.push('/'); // 로그인 성공 시 이동
		} else {
			switch (result.errorCode) {
      case 'USER_NOT_FOUND':
        setEmailError('이메일이 틀렸습니다.'); // 이메일 오류는 alert 또는 toast
        break;
      case 'INVALID_PASSWORD':
        setPasswordError('비밀번호가 틀렸습니다.'); // 비밀번호 오류는 입력 아래 빨간 글씨
        break;
      case 'ACCOUNT_LOCKED':
        setPasswordError('로그인 실패 5회로 계정이 잠겼습니다.');
        break;
      case 'ACCOUNT_DISABLED':
        setEmailError('비활성화된 계정입니다.');
        break;
      default:
        setPasswordError(result.message || '로그인에 실패했습니다.');
    }
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col items-center gap-4 w-full px-6 pt-[100px]"
		>
			<Icon name="Logo" size="xxl" className="w-[100px] h-auto mb-4" />
			<div className="w-full max-w-[343px] mt-7">
				<TextInputWithLabel
					label="이메일"
					value={username}
					onChange={setUsername}
					placeholder="이메일을 입력해주세요."
					inputClassName="w-[343px] h-[48px] hover:border border-primary-40 hover:text-primary-40 focus:border border-primary-40 focus:text-primary-40"
					labelClassName="text-grey-90"
				/>
				{emailError && <p className="text-red-500 text-sm mt-5 pl-2">{emailError}</p>}
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

				{passwordError && <p className="text-red-500 text-sm mt-5 pl-2">{passwordError}</p>}
			</div>

			<div className="w-full max-w-[343px] mt-[20px]">
				<PrimaryButton
					type="submit"
					text="로그인"
					className="w-[343px]"
					disabled={username.trim() === '' || password.trim() === ''}
					bgColorWhenEnabled="bg-grey-90"
					textColorWhenEnabled="text-primary-40"
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
				className="bg-[#FEE500] text-black w-[343px] h-[48px] rounded-[30px] font-medium mt-20"
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
