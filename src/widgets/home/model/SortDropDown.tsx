import React, { useEffect, useState } from 'react';

import PrimaryButton from '@/shared/components/PrimaryButton';
import Icon from '@/shared/ui/Icon';

interface SortDropdownProps {
	value: 'DISTANCE' | 'POPULARITY' | 'RATING' | 'SATISFACTION';
	onChange: (
		option: 'DISTANCE' | 'POPULARITY' | 'RATING' | 'SATISFACTION',
	) => void;
	locationAvailable?: boolean;
}

const SortDropdown: React.FC<SortDropdownProps> = ({
	value,
	onChange,
	locationAvailable,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState(value);
	useEffect(() => {
		setSelectedOption(value);
	}, [value]);
	const options: {
		value: 'DISTANCE' | 'POPULARITY' | 'RATING' | 'SATISFACTION';
		label: string;
	}[] = [
		{ value: 'DISTANCE', label: '가까운 순' },
		{ value: 'SATISFACTION', label: '최신 순' },
		{ value: 'POPULARITY', label: '인기 순' },
		{ value: 'RATING', label: '별점 높은 순' },
	];
	const filteredOptions = options.filter((opt) => {
		if (opt.value === 'DISTANCE') return locationAvailable; // 위치 허용 + 제주도만 DISTANCE 보여줌
		// 필요하면 RATING도 locationAvailable 조건 걸 수 있음
		return true;
	});

	const handleSelect = (option: typeof selectedOption) => {
		setSelectedOption(option);
		onChange(option);
	};

	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen((prev) => !prev)}
				className="flex items-center px-2 py-1.5 gap-1 rounded-full bg-grey-10 cursor-pointer"
			>
				<Icon name="Sort" size="xs" />
				<span className="text-[14px] font-semibold">
					{filteredOptions.find((o) => o.value === selectedOption)?.label || ''}
				</span>
			</button>

			{isOpen && (
				<div className="sm:w-[480px] w-[375px] fixed bottom-0 -ml-4 z-50 bg-white rounded-t-3xl p-4">
					<div className="w-10 h-[2px] bg-grey-70 rounded-full mx-auto mb-4" />

					{filteredOptions.map((option) => (
						<button
							key={option.value}
							onClick={() => handleSelect(option.value)}
							className="flex justify-between items-center w-full px-4 py-4 border border-grey-20 rounded-xl mb-2"
						>
							<span>{option.label}</span>
							<Icon
								name={
									selectedOption === option.value ? 'Radiobtn' : 'Emptyradiobin'
								}
								size="m"
							/>
						</button>
					))}

					<PrimaryButton
						text="닫기"
						onClick={() => setIsOpen(false)}
						className="w-full h-[48px] bg-grey-90 text-white mt-3"
					/>
				</div>
			)}
		</div>
	);
};

export default SortDropdown;
