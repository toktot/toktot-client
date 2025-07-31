// components/AgreementModal.tsx
'use client';

import { useState } from 'react';

import Icon from '@/widgets/icon';

import PrimaryButton from '@/shared/components/PrimaryButton';

// components/AgreementModal.tsx

// components/AgreementModal.tsx

// components/AgreementModal.tsx

// components/AgreementModal.tsx

const termsList = [
	{ id: 'terms1', label: '[필수] 개인정보 수집 및 이용 동의', required: true },
	{ id: 'terms2', label: '[필수] 개인정보처리방침', required: true },
	{ id: 'terms3', label: '[선택] 개인정보처리방침', required: false },
];

type Props = {
	onAgree: () => void;
};

export default function AgreementModal({ onAgree }: Props) {
	const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

	const allChecked = termsList.every((term) => checkedItems[term.id]);
	const requiredChecked = termsList
		.filter((t) => t.required)
		.every((t) => checkedItems[t.id]);

	const handleCheckAll = () => {
		const nextState: Record<string, boolean> = {};
		termsList.forEach((term) => {
			nextState[term.id] = !allChecked;
		});
		setCheckedItems(nextState);
	};

	const toggleCheck = (id: string) => {
		setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	return (
		<div className="rounded-t-2xl p-4 bg-white shadow-xl">
			<div className="flex flex-col gap-4">
				{/* 전체 동의 */}
				<div
					className="flex items-center gap-2 cursor-pointer"
					onClick={handleCheckAll}
				>
					<div
						className={`w-5 h-5 rounded-full flex items-center justify-center border ${
							allChecked
								? 'bg-primary-40 text-white border-primary-40'
								: 'border-gray-300'
						}`}
					>
						<Icon name={allChecked ? 'ReviewCurrent' : 'ReviewDisabled'} />
					</div>
					<span className="font-semibold">똑똑 이용약관 동의 (전체)</span>
				</div>

				{/* 개별 항목 */}
				<div className="flex flex-col gap-3 ml-3">
					{termsList.map((term) => (
						<div
							key={term.id}
							className="flex items-center justify-between cursor-pointer"
							onClick={() => toggleCheck(term.id)}
						>
							<div className="flex items-center gap-2">
								{term.id === 'terms1' ? (
									<Icon name={'Plus'} />
								) : (
									<div
										className={`w-5 h-5 rounded-full flex items-center justify-center border ${
											checkedItems[term.id]
												? 'bg-primary-40 text-white border-primary-40'
												: 'border-gray-300'
										}`}
									>
										<Icon
											name={
												checkedItems[term.id]
													? 'ReviewCurrent'
													: 'ReviewDisabled'
											}
										/>
									</div>
								)}

								<span className="text-sm text-gray-800">{term.label}</span>
							</div>
							<Icon name={'ArrowRight'} className="ml-10" />
						</div>
					))}
				</div>

				<PrimaryButton
					text="동의하고 진행하기"
					onClick={onAgree}
					disabled={!requiredChecked}
					bgColorWhenEnabled="bg-grey-90"
					textColorWhenEnabled="text-primary-40"
					className="mt-6 w-full"
				/>
			</div>
		</div>
	);
}
