'use client';

import { useEffect, useState } from 'react';

import clsx from 'clsx';

import TextInputWithLabel from '@/shared/components/TextInputWithLabel';
import Icon from '@/shared/ui/Icon';

type NicknameInputProps = {
	onSuccess: (nickname: string) => void;
};

export default function NicknameInput({ onSuccess }: NicknameInputProps) {
	const [nickname, setNickname] = useState('');
	const [checkResult, setCheckResult] = useState<
		'default' | 'available' | 'duplicate' | 'error'
	>('default');

	const isNickNameLengthValid = nickname.length >= 6 && nickname.length <= 20;
	const isNickNameFormatValid = /^[가-힣a-zA-Z0-9]+$/.test(nickname);
	const canSubmit =
		isNickNameLengthValid &&
		isNickNameFormatValid &&
		checkResult === 'available';

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
				if (result.success && result.data?.available === true) {
					setCheckResult('available');
				} else if (result.success && result.data?.available === false) {
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
	}, [nickname, isNickNameLengthValid, isNickNameFormatValid]);

	const getTextColor = () => {
		if (nickname.length == 0) {
			return 'text-grey-80';
		}
		if (!isNickNameLengthValid || !isNickNameFormatValid) return 'text-red-500';
		if (checkResult === 'duplicate') return 'text-red-500';
		if (checkResult === 'available') return 'text-green-500';
		return 'text-grey-50';
	};
	const showBorderColor = () => {
		if (nickname.length === 0) return 'border-none';
		if (!isNickNameLengthValid || !isNickNameFormatValid)
			return 'border-red-500';
		if (checkResult === 'available') return 'border-green-500';
		if (checkResult === 'duplicate') return 'border-red-500';
		return 'border-grey-40';
	};

	return (
		<div className="flex flex-col items-center pt-10">
			{/* 닉네임 입력창 */}
			<div className="relative w-[335px] h-[48px]">
				<TextInputWithLabel
					label="닉네임"
					value={nickname}
					onChange={(value) => {
						setNickname(value);
						setCheckResult('default');
					}}
					placeholder="닉네임을 입력해주세요."
					inputClassName={clsx(
						'min-w-[343px] h-[48px] bg-grey-10 text-black placeholder-grey-70 placeholder-[16px] pr-10 border',
						showBorderColor(),
					)}
					labelClassName="text-grey-60 text-[12px] mb-[2px] ml-1"
					className="rounded-3xl bg-grey-10"
				/>
				<div className="text-[11px] text-grey-80 ml-2 flex gap-6 mt-[25px]">
					<div className={getTextColor()}>
						<div className="flex flex-wrap gap-1 items-center">
							<Icon name="Check" size="xxs" />
							6자~20자
						</div>
					</div>
				</div>
			</div>

			{/* 메시지 영역 */}
			{checkResult === 'available' && isNickNameFormatValid && (
				<p className="text-green-500 text-sm mt-15 mr-6">
					'{nickname}'은 사용 가능한 닉네임이에요.
				</p>
			)}
			{checkResult === 'duplicate' && isNickNameLengthValid && nickname && (
				<p className="text-red-500 text-sm mt-15 mr-6">
					'{nickname}'은 다른 유저가 사용 중인 닉네임이에요.
				</p>
			)}
			<div className="absolute bottom-0 w-full flex flex-col items-center pb-3">
				{/* 동그란 닉네임 확인 버튼 */}
				<button
					onClick={() => onSuccess(nickname)}
					disabled={!canSubmit}
					className={clsx(
						'min-w-[343px] h-[45px] rounded-2xl mt-84 font-semibold',
						canSubmit
							? 'bg-grey-90 text-primary-40'
							: 'bg-grey-50 text-white cursor-not-allowed',
					)}
				>
					다음
				</button>
				<div className="flex justify-center items-center">
					<div className="border-1 border-grey-90 w-[72px] mt-3" />
				</div>
			</div>
		</div>
	);
}
