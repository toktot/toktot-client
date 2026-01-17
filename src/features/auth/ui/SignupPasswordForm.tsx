'use client';

import { useState } from 'react';

import PrimaryButton from '@/shared/components/PrimaryButton';
import TextInputWithLabel from '@/shared/components/TextInputWithLabel';
import Icon from '@/shared/ui/Icon';

type SignupNicknameProps = {
	onSuccess: (password: string) => void;
};

export default function SignupPasswordForm({ onSuccess }: SignupNicknameProps) {
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');

	const isPasswordLengthValid = password.length >= 8 && password.length <= 20;
	const isPasswordPatternValid =
		/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]).{8,20}$/.test(
			password,
		);
	const isPasswordValid = isPasswordLengthValid && isPasswordPatternValid;
	const isConfirmValid = password === confirm && confirm.length > 0;

	const canSubmit = isPasswordValid && isConfirmValid;

	const getTextColor = (isValid: boolean) => {
		if (password.length === 0) return 'text-grey-80 text-[11px]';
		return isValid ? 'text-green-500 text-[11px]' : 'text-red-500 text-[11px]';
	};

	return (
		<div className="flex flex-col flex-start p-5 space-y-6 max-w-md -ml-10 ">
			{/* 비밀번호 */}
			<TextInputWithLabel
				label="비밀번호"
				value={password}
				onChange={setPassword}
				placeholder="비밀번호를 입력하세요."
				type="password"
				className="w-full min-w-[343px] h-[48px]"
				labelClassName="text-grey-60 text-[12px]"
				inputClassName="placeholder-grey-70"
			/>

			<div className="text-sm ml-2 flex gap-6 mt-2">
				<div className={getTextColor(isPasswordLengthValid)}>
					<div className="flex flex-wrap gap-1 flex items-center">
						<Icon name="Check" size="xxs" />
						8자~20자
					</div>
				</div>
				<div className={getTextColor(isPasswordPatternValid)}>
					<div className="flex flex-wrap gap-1 flex items-center">
						<Icon name="Check" size="xxs" /> 영문, 숫자, 특수문자
					</div>
				</div>
			</div>

			{/* 비밀번호 재입력 */}
			<TextInputWithLabel
				label="비밀번호 재입력"
				value={confirm}
				onChange={setConfirm}
				placeholder="비밀번호를 다시 입력하세요."
				type="password"
				className="w-full min-w-[343px] h-[48px]"
				inputClassName={`${
					isConfirmValid
						? 'text-grey-90 border border-grey-10'
						: confirm.length > 0
							? 'text-primary-40 border border-primary-40'
							: ''
				} placeholder-grey-70`}
				labelClassName="text-grey-60 text-[12px] mt-10"
			/>
			{isConfirmValid && (
				<p className="text-green-500 text-sm ml-2 mt-15">
					비밀번호가 동일합니다.
				</p>
			)}
			{!isConfirmValid && confirm.length > 0 && (
				<p className="text-red-500 text-sm ml-2 mt-15">
					비밀번호가 일치하지 않습니다.
				</p>
			)}
			<div className="absolute bottom-0 left-4 flex flex-col pb-4">
				{/* 가입하기 버튼 */}
				<PrimaryButton
					onClick={() => onSuccess(password)}
					text="다음"
					disabled={!canSubmit}
					className={`min-w-[343px] rounded-2xl font-semibold mt-40 ${
						canSubmit
							? 'bg-grey-90 text-primary-40'
							: 'bg-grey-20 text-grey-50 cursor-not-allowed'
					}`}
				/>
				<div className="flex justify-center items-center">
					<div className="border-1 border-grey-90 w-[72px] mt-3" />
				</div>
			</div>
		</div>
	);
}
