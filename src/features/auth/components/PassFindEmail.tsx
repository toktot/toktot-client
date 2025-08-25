'use client';

import { useEffect, useState } from 'react';

import PrimaryButton from '@/shared/components/PrimaryButton';
import TextInputWithLabel from '@/shared/components/TextInputWithLabel';

type PassFindEmailProps = {
	onSuccess: (email: string) => void;
};

export default function PassFindEmail({ onSuccess }: PassFindEmailProps) {
	const [email, setEmail] = useState('');
	const [emailStatus, setEmailStatus] = useState<
		'idle' | 'valid' | 'invalid' | 'not_found'
	>('idle');
	const [verificationSent, setVerificationSent] = useState(false);
	const [code, setCode] = useState('');
	const [codeStatus, setCodeStatus] = useState<'idle' | 'valid' | 'invalid'>(
		'idle',
	);
	const [timer, setTimer] = useState(300); // 5분 (초)

	const isEmailValidFormat = (email: string) =>
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	useEffect(() => {
		if (!email) return setEmailStatus('idle');
		if (!isEmailValidFormat(email)) return setEmailStatus('invalid');

		const checkEmail = async () => {
			try {
				const res = await fetch(
					'https://api.toktot.site/v1/auth/password/reset/send',
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ email }),
					},
				);
				const data = await res.json();
				console.log(data.errorCode);
				if (data.errorCode === 'USER_NOT_FOUND') {
					setEmailStatus('not_found');
				} else {
					setEmailStatus('valid');
				}
			} catch (err) {
				console.error(err);
				setEmailStatus('not_found');
			}
		};
		checkEmail();
	}, [email]);

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
			const res = await fetch(
				'https://api.toktot.site/v1/auth/password/reset/send',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ email }),
				},
			);
			const data = await res.json();
			if (res.ok) {
				setVerificationSent(true);
				setTimer(300);
				alert('인증번호가 전송됐습니다.');
			} else {
				alert(data.message || '인증번호 전송 실패');
			}
		} catch (err) {
			console.error(err);
			alert('서버에 연결할 수 없습니다.');
		}
	};

	const handleCheckCode = async () => {
		try {
			const res = await fetch(
				'https://api.toktot.site/v1/auth/password/reset/send',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email, verfication_code: code }),
				},
			);
			const data = await res.json();
			if (data.success) {
				setCodeStatus('valid');
			} else {
				setCodeStatus('invalid');
			}
		} catch (err) {
			console.error(err);
		}
	};
	return (
		<div className="p-6 space-y-4 max-w-md">
			<TextInputWithLabel
				label="에메일"
				value={email}
				onChange={(value) => setEmail(value)}
				placeholder="이메일을 입력해주세요."
				inputClassName={`w-[343px] h-[48px] rounded-[18px] mb-2 border hover:text-primary-40 hover:border-primary-40 ${
					{
						not_found: 'border-red-500',
						invalid: 'border-red-500',
						valid: 'border-grey-30 text-grey-90',
						idle: 'border-grey-30',
					}[emailStatus]
				}`}
			/>
			{emailStatus === 'not_found' && (
				<p className="text-red-500 text-sm mt-1">
					이메일 주소를 다시 확인하세요.
				</p>
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
				bgColorWhenEnabled="bg-grey-90"
				textColorWhenEnabled="text-primary-40"
			/>
			<div>
				<label className="text-grey-60 text-sm mb-1 block">인증번호</label>
				<div className="flex gap-2 items-center">
					<TextInputWithLabel
						value={code}
						onChange={(value) => {
							setCode(value);
							setCodeStatus('idle');
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
						bgColorWhenEnabled="bg-primary-40"
						textColorWhenEnabled="text-grey-90"
					/>
				</div>
				{codeStatus === 'valid' && (
					<p className="text-green-500 text-sm mt-1">인증번호가 일치합니다.</p>
				)}
				{codeStatus === 'invalid' && (
					<p className="text-red-500 text-sm mt-1">
						인증번호를 다시 입력해주세요.
					</p>
				)}
			</div>

			<PrimaryButton
				text="다음"
				onClick={() => onSuccess(email)}
				disabled={code.length !== 6 || codeStatus === 'valid'}
				className="w-[343px]"
				bgColorWhenEnabled="bg-grey-90"
				textColorWhenEnabled="text-primary-40"
			/>
		</div>
	);
}
