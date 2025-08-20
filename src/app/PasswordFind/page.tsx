'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import Icon from '@/shared/ui/Icon';

import PassFindEmail from '../../features/auth/components/PassFindEmail';
import PassSet from '../../features/auth/components/PassSet';

export default function SignupPage() {
	const [step, setStep] = useState<'email' | 'password' | 'complete'>('email');
	const [email, setEmail] = useState('');

	const renderTitle = () => {
		switch (step) {
			case 'email':
				return '가입한 이메일을 입력해주세요';
			case 'password':
				return '새로운 비밀번호를 등록해주세요';
			case 'complete':
				return '';
		}
	};
	const router = useRouter();
	const handleEmailSuccess = (verifiedEmail: string) => {
		setEmail(verifiedEmail);

		setStep('password');
	};
	return (
		<div className="min-h-screen flex flex-col items-center justify-start pt-6">
			<div className="flex items-center justify-between px-4 w-full max-w-md mb-2">
				<Icon name={'Back'} size="m"></Icon>
				<h1 className="text-base font-semibold">비밀번호 찾기</h1>
				<Icon name={'None'} size="m"></Icon>
			</div>
			{step !== 'complete' && (
				<p className="text-lg font-semibold text-center mt-8">
					{renderTitle()}
				</p>
			)}
			<div className="flex flex-1 justify-center items-start">
				<div className="w-full max-w-md mt-10 px-6">
					{step === 'email' && <PassFindEmail onSuccess={handleEmailSuccess} />}
					{step === 'password' && (
						<PassSet email={email} onSuccess={() => setStep('complete')} />
					)}

					{step === 'complete' && (
						<div className="flex flex-col items-center justify-center mt-50">
							<div className="flex flex-col gap-1 text-center text-[#000000] text-[28px] font-bold h-[34px] mt-12">
								<span className="mb-2">
									비밀번호 재등록이
									<br /> 완료됐어요!
								</span>
								<span className="text-[12px] text-grey-80">
									로그인 화면에서 새로운 비밀번호로
									<br />
									로그인이 가능해요.
								</span>
								<button
									className="min-w-[343px] h-[48px] mt-55 rounded-2xl font-semibold bg-grey-90 text-primary-40"
									onClick={() => router.push('/login')}
								>
									로그인하러 가기
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
