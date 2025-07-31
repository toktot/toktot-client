// SignupPage.tsx
'use client';

import { useState } from 'react';

import AgreementModal from '@/features/auth/components/Agree';
import NicknameInput from '@/features/auth/components/SignupNickname';

import Icon from '@/shared/ui/Icon';

import SignupEmailForm from '../../features/auth/components/SignupEmailForm';
import SignupPasswordForm from '../../features/auth/components/SignupPasswordForm';

// SignupPage.tsx

// SignupPage.tsx

// SignupPage.tsx

// SignupPage.tsx

// SignupPage.tsx

// SignupPage.tsx

// SignupPage.tsx

export default function SignupPage() {
	const [step, setStep] = useState<
		'agreement' | 'email' | 'password' | 'nickname' | 'complete'
	>('agreement');
	const [nickname, setNickname] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const renderTitle = () => {
		switch (step) {
			case 'email':
				return '이메일을 입력해주세요';
			case 'password':
				return '비밀번호를 입력해주세요';
			case 'nickname':
				return '닉네임을 입력해주세요';
			case 'complete':
				return '';
		}
	};
	const handleRegister = async () => {
		try {
			const res = await fetch('http://13.209.53.44/api/v1/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({
					email,
					password,
					nickname,
				}),
			});
			const data = await res.json();

			if (data.success) {
				alert('회원가입이 완료됐습니다.');
			} else {
				alert(data.message || '회원가입에 실패했습니다.');
			}
		} catch (err) {
			alert('서버와 연결할 수 없습니다.');
			console.log(err);
		}
	};
	return (
		<div className="min-h-screen flex flex-col items-center justify-start pt-6">
			<div className="flex items-center justify-between px-4 w-full max-w-md mb-2">
				<Icon name={'Back'} size="m" className="ml-10"></Icon>
				<h1 className="text-base font-semibold">회원가입</h1>
				<Icon name={'None'} size="m" className="mr-15"></Icon>
			</div>
			{step !== 'complete' && step !== 'agreement' && (
				<p className="text-lg font-semibold text-center mt-8">
					{renderTitle()}
				</p>
			)}
			<div className="flex flex-1 justify-center items-start">
				<div className="w-full max-w-md mt-10 px-6">
					{step === 'agreement' && (
						<AgreementModal onAgree={() => setStep('email')} />
					)}
					{step === 'email' && (
						<SignupEmailForm
							onSuccess={(enteredEmail) => {
								setEmail(enteredEmail);
								setStep('password');
							}}
						/>
					)}
					{step === 'password' && (
						<SignupPasswordForm
							onSuccess={(enteredPassword) => {
								setPassword(enteredPassword);
								setStep('nickname');
							}}
						/>
					)}
					{step === 'nickname' && (
						<NicknameInput
							onSuccess={(enteredNickname: string) => {
								setNickname(enteredNickname);
								setStep('complete');
							}}
						/>
					)}
					{step === 'complete' && (
						<p className="text-center text-[#000000] text-[28px] font-bold h-[34px] mt-12">
							환영해요, {nickname}님!
							<button
								className="w-[335px] h-[48px] mt-6 rounded-md font-semibold bg-grey-90 text-primary-40"
								onClick={handleRegister}
							>
								다음
							</button>
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
