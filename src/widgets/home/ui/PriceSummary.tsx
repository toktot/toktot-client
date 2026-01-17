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
			className="bg-white rounded-xl p-4 min-w-[341px] max-w-[420px] w-full cursor-pointer"
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

			<div className=" mt-2 flex justify-between font-semibold text-grey-90 text-[11px]">
				<span>{formatKRW(minPrice)}원</span>
				<span>{formatKRW(avgPrice)}원</span>
				<span>{formatKRW(maxPrice)}원</span>
			</div>
			<div className=" flex justify-between text-[9px]">
				<span className="text-grey-70">최저</span>
				<span className="text-grey-70">평균</span>
				<span className="text-grey-70">최고</span>
			</div>
		</div>
	);
};

export default PriceSummary;
