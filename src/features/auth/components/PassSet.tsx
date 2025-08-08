'use client';

import { useState } from 'react';

import PrimaryButton from '@/shared/components/PrimaryButton';
import TextInputWithLabel from '@/shared/components/TextInputWithLabel';

type PassSetProps = {
	onSuccess: () => void;
};

export default function SignupPasswordForm({ onSuccess }: PassSetProps) {
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
		if (password.length === 0) return 'text-grey-50';
		return isValid ? 'text-green-500' : 'text-red-500';
	};
	/*
  const handleResetPassword = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://13.209.53.44:8080/api/v1/auth/password/reset/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({new_password: password }),
    });
    const data = await res.json();
    if (data.success) {
      onSuccess();
    } else {
      alert(data.message || "비밀번호 변경에 실패했습니다.")
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
*/
	return (
		<div className="p-6 space-y-4 max-w-md">
			{/* 비밀번호 */}
			<TextInputWithLabel
				label="비밀번호"
				value={password}
				onChange={setPassword}
				placeholder="비밀번호를 입력하세요."
				type="password"
			/>

			<div className="text-sm ml-2 flex gap-6">
				<p className={getTextColor(isPasswordLengthValid)}>🗸 8자~20자</p>
				<p className={getTextColor(isPasswordPatternValid)}>
					🗸 영문, 숫자, 특수문자
				</p>
			</div>

			{/* 비밀번호 재입력 */}
			<TextInputWithLabel
				label="비밀번호 재입력"
				value={confirm}
				onChange={setConfirm}
				placeholder="비밀번호를 다시 입력하세요."
				type="password"
				inputClassName={`${
					confirm.length > 0 ? 'border-primary-40 focus:border-primary-40' : ''
				}`}
				labelClassName={`${confirm.length > 0 ? 'text-primary-40' : ''}`}
			/>
			{isConfirmValid && (
				<p className="text-green-500 text-sm ml-2">비밀번호가 동일합니다.</p>
			)}
			{!isConfirmValid && confirm.length > 0 && (
				<p className="text-red-500 text-sm ml-2">
					비밀번호가 일치하지 않습니다.
				</p>
			)}

			{/* 가입하기 버튼 */}
			<PrimaryButton
				onClick={onSuccess}
				text="가입하기"
				disabled={!canSubmit}
				className={`w-full h-[48px] rounded-md font-semibold ${
					canSubmit
						? 'bg-grey-90 text-primary-40'
						: 'bg-grey-20 text-grey-50 cursor-not-allowed'
				}`}
			/>
		</div>
	);
}
