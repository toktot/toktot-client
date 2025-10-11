'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import AgreementModal from '@/features/auth/components/Agree';
import NicknameInput from '@/features/auth/components/SignupNickname';

import Icon from '@/shared/ui/Icon';

import SignupEmailForm from '../../features/auth/components/SignupEmailForm';
import SignupPasswordForm from '../../features/auth/components/SignupPasswordForm';

export default function SignupPage() {
	const [step, setStep] = useState<
		'agreement' | 'email' | 'password' | 'nickname' | 'complete'
	>('agreement');
	const [nickname, setNickname] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();
	const renderTitle = () => {
		let title = '';
		switch (step) {
			case 'email':
				title = '이메일을 입력해주세요';
				break;
			case 'password':
				title = '비밀번호를 입력해주세요';
				break;
			case 'nickname':
				title = '닉네임을 입력해주세요';
				break;
			case 'complete':
				return null;
		}
		return title.split(' ').map((word, idx, arr) => (
			<span key={idx}>
				{word}
				{idx < arr.length - 1 && <br />}
			</span>
		));
	};
	const handleRegister = async () => {
		try {
			const res = await fetch('https://api.toktot.site/v1/auth/register', {
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
			console.log({ email, password, nickname });
			console.log(res.status);
			console.log(data);

			if (data.success) {
				router.push('/login');
			} else {
				console.log(data.message || '회원가입에 실패했습니다.');
			}
		} catch (err) {
			alert('서버와 연결할 수 없습니다.');
			console.log(err);
		}
	};
	return (
		<div
			className={`min-h-screen flex flex-col items-center justify-start pt-6 ${
				step === 'agreement' ? 'bg-grey-60' : 'bg-white'
			}`}
		>
			<div className="flex items-center justify-between px-4 w-full max-w-md mb-2">
				<Icon name={'ArrowLefttBar'} size="xxl" className="border-[#74808E]" />
				<h1 className="text-base font-semibold">회원가입</h1>
				<Icon name={'Cancel'} size="xl" className="border-[#74808E]" />
			</div>
			{step !== 'complete' && step !== 'agreement' && (
				<p className="text-[28px] font-semibold mt-15 w-full text-center">
					{renderTitle()}
				</p>
			)}
			<div className="flex flex-1 justify-center items-start">
				<div className="w-full max-w-md mt-10 px-6">
					{step === 'agreement' && (
						<div className="fixed inset-0 flex items-end justify-center z-50">
							<div className="absolute inset-0 bg-black/60 backdrop-blur-xxs"></div>

							<AgreementModal onAgree={() => setStep('email')} />
						</div>
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
						<div className="flex flex-col items-center justify-center mt-50">
							<div className="text-center text-[#000000] text-[28px] font-bold h-[34px] mt-12">
								환영해요, {nickname}님!
								<div className="justify-center w-full flex flex-col items-center pb-3">
									<button
										className="flex items-center justify-center min-w-[343px] h-[48px] mt-80 rounded-2xl font-semibold bg-grey-90 text-primary-40"
										onClick={handleRegister}
									>
										<Icon name="Plus" />
										다음
									</button>
									<div className="flex justify-center items-center">
										<div className="border-1 border-grey-90 w-[72px] mt-3" />
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
