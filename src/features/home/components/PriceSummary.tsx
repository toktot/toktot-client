'use client';

import { useRouter } from 'next/navigation';

import { IconName } from '@/shared/icons/iconMap';
import Icon from '@/shared/ui/Icon';

export interface PriceSummaryProps {
	MenuName: string;
	icon: IconName;
	id: number;
	type?: string;
	avgPrice: number;
	minPrice: number;
	maxPrice: number;
	minRate: number;
	maxRate: number;
}

const formatKRW = (n: number) => n.toLocaleString('ko-KR');

const PriceSummary: React.FC<PriceSummaryProps> = ({
	MenuName,
	icon,
	avgPrice,
	minPrice,
	maxPrice,
}) => {
	const percent = ((avgPrice - minPrice) / (maxPrice - minPrice)) * 100;
	const gradientStyle = {
		width: `${percent}%`,
		height: '100%',
		borderRadius: '9999px',
		background:
			'linear-gradient(to right, #EDD067, #F1AC7A, #F17A7A, #E7B897, #F4EE2c)',
	};
	const router = useRouter();
	const handleClick = () => {
		router.push(`/MenuPrice?q=${encodeURIComponent(MenuName)}`);
	};
	return (
		<div
			className="rounded-xl border border-gray-100 p-4 cursor-pointer"
			onClick={handleClick}
		>
			<div className="flex items-center justify-between text-sm text-gray-500">
				<span className="flex items-center gap-1">
					<Icon name={icon} />
					{MenuName} 1인 평균
				</span>
				<span className="text-gray-900 font-semibold">
					{formatKRW(avgPrice)}원
				</span>
			</div>

			{/* Progress bar */}
			<div className="relative mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
				<div className="absolute top-0 left-0" style={gradientStyle} />
			</div>

			<div className="mt-2 flex justify-between text-xs text-gray-400">
				<span>저렴한</span>
				<span>평균</span>
				<span>같이 있는</span>
			</div>

			<div className="mt-1 flex justify-between text-xs text-gray-500">
				<span>{formatKRW(minPrice)}</span>
				<span>{formatKRW(avgPrice)}</span>
				<span>{formatKRW(maxPrice)}</span>
			</div>
		</div>
	);
};

export default PriceSummary;
