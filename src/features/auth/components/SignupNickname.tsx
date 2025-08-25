'use client';

import { useEffect, useState } from 'react';

import clsx from 'clsx';

import TextInputWithLabel from '@/shared/components/TextInputWithLabel';

type NicknameInputProps = {
	onSuccess: (nickname: string) => void;
};

export default function NicknameInput({ onSuccess }: NicknameInputProps) {
	const [nickname, setNickname] = useState('');
	const [checkResult, setCheckResult] = useState<
		'default' | 'available' | 'duplicate' | 'error'
	>('default');

	const isNickNameLengthValid = nickname.length >= 6 && nickname.length <= 20;

	const canSubmit = isNickNameLengthValid && checkResult === 'available';

	useEffect(() => {
		const handleCheckNickname = async () => {
			try {
				const res = await fetch(
					'https://api.toktot.site/v1/auth/nickname/check',
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ nickname }),
					},
				);

				if (!res.ok) {
					console.error('서버 오류', res.status);
					setCheckResult('error');
					return;
				}
				const result = await res.json();
				if (result.success === false) {
					setCheckResult('duplicate');
				} else {
					setCheckResult('available');
				}
			} catch (err) {
				console.error('API 요청 실패', err);
				setCheckResult('error');
			}
		};

		const delayDebounce = setTimeout(() => {
			if (isNickNameLengthValid) {
				handleCheckNickname();
			} else {
				setCheckResult('default');
			}
		}, 500);
		return () => clearTimeout(delayDebounce);
	}, [nickname, isNickNameLengthValid]);

	const getTextColor = () => {
		if (nickname.length == 0) {
			return 'text-grey-50';
		}
		if (!isNickNameLengthValid) return 'text-red-500';
		if (checkResult === 'duplicate') return 'text-red-500';
		if (checkResult === 'available') return 'text-green-500';
		return 'text-grey-50';
	};
	const showBorderColor = () => {
		if (nickname.length === 0) return 'border-none';
		if (!isNickNameLengthValid) return 'border-red-500';
		if (checkResult === 'available') return 'border-green-500';
		if (checkResult === 'duplicate') return 'border-red-500';
		return 'border-grey-40';
	};

	return (
		<div className="flex flex-col items-center pt-10">
			{/* 닉네임 입력창 */}
			<div className="relative w-[335px]">
				<TextInputWithLabel
					label="닉네임"
					value={nickname}
					onChange={(value) => {
						setNickname(value);
						setCheckResult('default');
					}}
					placeholder="닉네임을 입력해주세요."
					inputClassName={clsx(
						'min-w-[343px] h-[48px] bg-white text-black bg-grey-20 placeholder-grey-70 pr-10 border',
						showBorderColor(),
					)}
					labelClassName="text-grey-60 mb-[2px]"
					className="rounded-3xl"
				/>
				<div className="text-sm ml-2 flex gap-6 mt-[25px]">
					<p className={getTextColor()}>🗸 6자~20</p>
				</div>
			</div>

			{/* 메시지 영역 */}
			{checkResult === 'available' && (
				<p className="text-green-500 text-sm mt-3 mr-25">
					'{nickname}'은 사용 가능한 닉네임이에요.
				</p>
			)}
			{checkResult === 'duplicate' && isNickNameLengthValid && nickname && (
				<p className="text-red-500 text-sm mt-3 mr-13">
					'{nickname}'은 다른 유저가 사용 중인 닉네임이에요.
				</p>
			)}

			{/* 동그란 닉네임 확인 버튼 */}
			<button
				onClick={() => onSuccess(nickname)}
				disabled={!canSubmit}
				className={clsx(
					'min-w-[343px] h-[45px] rounded-2xl mt-80 font-semibold',
					canSubmit
						? 'bg-grey-90 text-primary-40'
						: 'bg-grey-50 text-white cursor-not-allowed',
				)}
			>
				다음
			</button>
		</div>
	);
}
