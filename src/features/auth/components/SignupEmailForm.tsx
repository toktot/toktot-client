// SignupEmailForm.tsx
'use client';

import { useEffect, useState } from 'react';

import PrimaryButton from '@/shared/components/PrimaryButton';
import TextInputWithLabel from '@/shared/components/TextInputWithLabel';

// SignupEmailForm.tsx

// SignupEmailForm.tsx

// SignupEmailForm.tsx

// SignupEmailForm.tsx

// SignupEmailForm.tsx

// SignupEmailForm.tsx

function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);
		return () => clearTimeout(handler);
	}, [value, delay]);

	return debouncedValue;
}

type SignupEmailFormProps = {
	onSuccess: (email: string) => void;
};

export default function SignupEmailForm({ onSuccess }: SignupEmailFormProps) {
	const [email, setEmail] = useState('');
	const debouncedEmail = useDebounce(email, 500);
	const [emailStatus, setEmailStatus] = useState<
		'idle' | 'valid' | 'invalid' | 'duplicate'
	>('idle');
	const [verificationSent, setVerificationSent] = useState(false);
	const [verifiedCode, setVerifiedCode] = useState<string | null>(null);
	const [code, setCode] = useState('');
	const [codeStatus, setCodeStatus] = useState<'idle' | 'valid' | 'invalid'>(
		'idle',
	);
	const [timer, setTimer] = useState(300); // 5분 (초)

	const isEmailValidFormat = (email: string) =>
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	// 가짜 중복 체크 API
	const checkDuplicateEmail = async (
		email: string,
	): Promise<'duplicate' | 'invalid' | 'valid'> => {
		if (!isEmailValidFormat(email)) {
			return 'invalid';
		}
		try {
			const res = await fetch(`http://13.209.53.44/api/v1/auth/email/send`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ email }),
			});
			const data = await res.json();
			if (data.message == '이미 사용중인 이메일입니다.') {
				return 'duplicate';
			} else {
				return 'valid';
			}
		} catch (error) {
			console.error('중복 확인 실패', error);
			return 'invalid';
		}
	};

	useEffect(() => {
		if (!debouncedEmail) {
			setEmailStatus('idle');
			return;
		}

		checkDuplicateEmail(debouncedEmail).then((res) => {
			setEmailStatus(res);
		});
	}, [debouncedEmail]);

	useEffect(() => {
		if (verificationSent && timer > 0) {
			const interval = setInterval(() => {
				setTimer((t) => t - 1);
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [verificationSent, timer]);

	const formatTimer = (sec: number) => {
		const m = String(Math.floor(sec / 60)).padStart(2, '0');
		const s = String(sec % 60).padStart(2, '0');
		return `${m}분 ${s}초`;
	};

	const handleSendCode = async () => {
		try {
			const res = await fetch('http://13.209.53.44/api/v1/auth/email/send', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ email }),
			});
			const data = await res.json();

			if (data.success) {
				setVerificationSent(true);
				setTimer(300);
				setVerifiedCode(null);
				setCodeStatus('idle');
			} else {
				console.warn('인증 이메일 전송 실패', data);
				alert(data.message || '인증번호 전송에 실패했습니다.');
			}
		} catch (err) {
			console.error(err);
			alert('서버에 연결할 수 없습니다.');
		}
	};

	const handleCheckCode = async () => {
		if (code === verifiedCode) {
			setVerifiedCode(code);
			setCodeStatus('valid');
			return;
		}
		try {
			const res = await fetch('http://13.209.53.44/api/v1/auth/email/verify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },

				body: JSON.stringify({ email, verification_code: code }),
			});
			const data = await res.json();
			console.log('verify 응답', data);
			if (data.success) {
				setCodeStatus('valid');
				setVerifiedCode(code);
			} else {
				setCodeStatus('invalid');
			}
		} catch (err) {
			console.error('서버 연결 실패', err);
			alert('서버에 연결할 수 없습니다.');
		}
	};

	const canGoNext = emailStatus === 'valid' && codeStatus === 'valid';

	return (
		<div className="p-6 space-y-4 max-w-md">
			<TextInputWithLabel
				label="이메일"
				value={email}
				onChange={(value) => setEmail(value)}
				placeholder="이메일을 입력해주세요."
				inputClassName={`w-[343px] h-[48px] rounded-[18px] mb-2 border ${
					{
						duplicate: 'border-red-500',
						invalid: 'border-red-500',
						valid: 'border-green-500',
						idle: 'border-grey-30',
					}[emailStatus]
				}`}
			/>
			{emailStatus === 'invalid' && (
				<p className="text-red-500 text-sm mt-1">
					이메일 형식이 올바르지 않습니다.
				</p>
			)}
			{emailStatus === 'duplicate' && (
				<p className="text-red-500 text-sm mt-1">이미 사용중인 이메일이에요.</p>
			)}
			{emailStatus === 'valid' && (
				<p className="text-green-500 text-sm mt-1">사용가능한 이메일이에요.</p>
			)}

			<PrimaryButton
				text={
					verificationSent
						? `인증번호 다시 받기 (${formatTimer(timer)})`
						: '인증번호 전송'
				}
				onClick={handleSendCode}
				disabled={emailStatus !== 'valid'}
				className="w-[343px] mt-3"
				bgColorWhenEnabled="bg-grey-80"
				textColorWhenEnabled="text-[#FFFFFF]"
			/>

			<div>
				<label className="text-grey-60 text-sm mb-1 block">인증번호</label>
				<div className="flex gap-2 items-center">
					<TextInputWithLabel
						value={code}
						onChange={(value) => {
							setCode(value);
							if (value !== verifiedCode) {
								setCodeStatus('idle');
							}
						}}
						placeholder="6자리를 입력해주세요."
						inputClassName={`w-[236px] h-[48px] rounded-[18px] border ${
							codeStatus === 'valid'
								? 'border-green-500'
								: codeStatus === 'invalid'
									? 'border-red-500'
									: 'border-grey-30'
						}`}
					/>
					<PrimaryButton
						text="확인"
						onClick={handleCheckCode}
						disabled={code.length !== 6 || codeStatus === 'valid'}
						className="w-[110px] mr-4"
						bgColorWhenEnabled="bg-grey-90"
						textColorWhenEnabled="text-grey-10"
					/>
				</div>
				{codeStatus === 'valid' && (
					<p className="text-green-500 text-sm mt-1">인증번호가 일치합니다.</p>
				)}
			</div>

			<PrimaryButton
				text="다음"
				onClick={() => {
					if (canGoNext) {
						onSuccess(email);
					}
				}}
				disabled={!canGoNext}
				className="w-[343px]"
				bgColorWhenEnabled="bg-grey-90"
				textColorWhenEnabled="text-primary-40"
			/>
		</div>
	);
}
