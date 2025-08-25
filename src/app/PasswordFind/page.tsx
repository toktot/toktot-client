'use client';

import { useState } from 'react';

import Icon from '@/shared/ui/Icon';

import PassFindEmail from '../../features/auth/components/PassFindEmail';
import PassSet from '../../features/auth/components/PassSet';

export default function SignupPage() {
	const [step, setStep] = useState<'email' | 'password' | 'complete'>('email');
	const [email, setEmail] = useState(''); // ✅ email state 추가
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
	return (
		<div className="min-h-screen flex flex-col items-center justify-start pt-6">
			<div className="flex items-center justify-between px-4 w-full max-w-md mb-2">
				<Icon name={'Back'} size="m" className="ml-10"></Icon>
				<h1 className="text-base font-semibold">비밀번호 찾기</h1>
				<Icon name={'None'} size="m" className="mr-15"></Icon>
			</div>
			{step !== 'complete' && (
				<p className="text-lg font-semibold text-center mt-8">
					{renderTitle()}
				</p>
			)}
			<div className="flex flex-1 justify-center items-start">
				<div className="w-full max-w-md mt-10 px-6">
					{step === 'email' && (
						<PassFindEmail
							onSuccess={(emailFromChild) => {
								setEmail(emailFromChild);
								setStep('password');
							}}
						/>
					)}
					{step === 'password' && (
						<PassSet email={email} onSuccess={() => setStep('complete')} />
					)}

					{step === 'complete' && (
						<p className="text-center text-[#000000] text-[28px] font-bold h-[34px] mt-12">
							비밀번호 재등록이 완료됐어요!
							<button className="w-[335px] h-[48px] mt-6 rounded-md font-semibold bg-grey-90 text-primary-40">
								로그인하러 가기
							</button>
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
