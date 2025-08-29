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
					<span className="text-grey-90 font-semibold">{MenuName}</span>
					<span className="text-grey-80 text-[12px] mt-1">1인 평균</span>

					<span className="text-grey-90 font-semibold">
						{formatKRW(avgPrice)}
					</span>
					<span className="text-[12px] text-grey-90">원</span>
				</span>
				<Icon name={'ArrowRight'} size="xs" className="text-grey-50" />
			</div>

			{/* Progress bar */}
			<div className="relative mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
				<div
					className="absolute top-0 left-0 h-full rounded-full"
					style={{
						width: `100%`,
						background:
							'linear-gradient(to right, #D4DEE5, #38DEFF, #1A73E9, #38DEFF, #D4DEE5)',
					}}
				/>
			</div>

			<div className="mt-2 flex justify-between text-xs text-gray-400">
				<span className="text-grey-90">최저</span>
				<span className="text-grey-90">평균</span>
				<span className="text-grey-90">최고</span>
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
