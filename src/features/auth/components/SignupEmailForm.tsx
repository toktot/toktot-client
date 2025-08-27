'use client';

import { useCallback, useEffect, useState } from 'react';

import PrimaryButton from '@/shared/components/PrimaryButton';
import TextInputWithLabel from '@/shared/components/TextInputWithLabel';

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
	const checkDuplicateEmail = useCallback(
		async (email: string): Promise<'duplicate' | 'invalid' | 'valid'> => {
			if (!isEmailValidFormat(email)) {
				return 'invalid';
			}
			try {
				const res = await fetch(`https://api.toktot.site/v1/auth/email/send`, {
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
		},
		[],
	);

	useEffect(() => {
		if (!debouncedEmail) {
			setEmailStatus('idle');
			return;
		}

		checkDuplicateEmail(debouncedEmail).then((res) => {
			setEmailStatus(res);
		});
	}, [checkDuplicateEmail, debouncedEmail]);

	const formatTimer = (sec: number) => {
		const m = String(Math.floor(sec / 60)).padStart(2, '0');
		const s = String(sec % 60).padStart(2, '0');
		return `${m}분 ${s}초`;
	};
	useEffect(() => {
		if (!verificationSent) return;
		if (timer <= 0) return;
		const interval = setInterval(() => {
			setTimer((t) => t - 1);
		}, 1000);
		return () => clearInterval(interval);
	}, [verificationSent, timer]);

	const handleSendCode = async () => {
		if (!isEmailValidFormat(email)) {
			setEmailStatus('invalid');
			return;
		}
		if (verificationSent && timer > 240) {
			console.warn('너무 자주 요청했어요. 1분 뒤에 다시 시도해주세요.');
			return;
		}
		try {
			const res = await fetch('https://api.toktot.site/v1/auth/email/send', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ email }),
			});
			const data = await res.json();

			if (res.ok) {
				console.log('이메일 전송');
				setVerificationSent(true);
				setTimer(300);
				setVerifiedCode(null);
				setCodeStatus('idle');
				setCode('');
			} else {
				console.warn('인증 이메일 전송 실패', data);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const handleCheckCode = async () => {
		if (code === verifiedCode) {
			setVerifiedCode(code);
			setCodeStatus('valid');
			return;
		}
		try {
			const res = await fetch('https://api.toktot.site/v1/auth/email/verify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },

				body: JSON.stringify({ email, verification_code: code }),
			});
			const data = await res.json();

			if (data.success) {
				setCodeStatus('valid');
				setVerifiedCode(code);
				console.log('데이터 전송성공');
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
		<div className="p-6 space-y-4 max-w-md ml-1">
			<TextInputWithLabel
				label="이메일"
				value={email}
				onChange={(value) => setEmail(value)}
				placeholder="이메일을 입력해주세요."
				labelClassName="text-[12px] text-grey-60 ml-1"
				placeholderClassName="text-[16px] text-grey-70"
				inputClassName={`w-[343px] h-[48px] rounded-[18px] mb-2 border bg-grey-10 ${
					{
						duplicate: 'border-red-500',
						invalid: 'border-red-500',
						valid: 'border-green-500',
						idle: 'border-none',
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
				disabledColor="bg-grey-50 text-white"
				className="w-[343px] mt-3 border-grey-50"
				bgColorWhenEnabled="bg-grey-80"
				textColorWhenEnabled="text-primary-40"
			/>

			<div>
				<label className="text-grey-60 text-sm mt-4 block ml-1">인증번호</label>
				<div className="flex gap-2 items-center">
					<TextInputWithLabel
						value={code}
						onChange={(value) => {
							setCode(value);
							if (value !== verifiedCode) {
								setCodeStatus('idle');
							}
						}}
						placeholder="6자를 입력해주세요."
						labelClassName="text-[12px] text-grey-60"
						placeholderClassName="text-[16px] text-grey-70"
						inputClassName={`w-[236px] h-[48px] rounded-[18px] border ${
							codeStatus === 'valid'
								? 'border-green-500'
								: codeStatus === 'invalid'
									? 'border-red-500'
									: 'border-none'
						}`}
					/>
					<PrimaryButton
						text="확인"
						onClick={handleCheckCode}
						disabled={code.length !== 6 || codeStatus === 'valid'}
						className="w-[120px] h-[48px] mr-1 text-[14px]"
						bgColorWhenEnabled={code.length === 6 ? 'bg-grey-90' : 'bg-grey-30'}
						textColorWhenEnabled={
							code.length === 6 ? 'text-white' : 'text-grey-80'
						}
						disabledColor="bg-grey-30 text-grey-80"
					/>
				</div>
				{codeStatus === 'valid' && (
					<p className="text-green-500 text-sm mt-1">인증번호가 일치합니다.</p>
				)}
			</div>
			<div className="absolute bottom-0 w-full flex flex-col items-center pb-6">
				<PrimaryButton
					text="다음"
					onClick={() => {
						if (canGoNext) {
							onSuccess(email);
						}
					}}
					disabled={!canGoNext}
					className="w-[343px] h-[48px] mr-7"
					bgColorWhenEnabled="bg-grey-90"
					textColorWhenEnabled="text-primary-40"
					disabledColor="bg-grey-50 text-white"
				/>
				<div className="flex justify-center items-center mr-7">
					<div className="border-1 border-grey-90 w-[72px] mt-2" />
				</div>
			</div>
		</div>
	);
}
