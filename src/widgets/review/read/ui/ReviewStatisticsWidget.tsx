import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import { useReviewStatistics } from '@/features/review/read/hooks/useReviewStatistics';

import { StoreId } from '@/shared/model/types';
import Icon from '@/shared/ui/Icon';
import Typography from '@/shared/ui/Typography';

const cn = (...inputs: (string | undefined | null | boolean)[]) => {
	return twMerge(clsx(inputs));
};

interface BarProps {
	valuePercent: number;
	barClassName: string;
	rawValue?: string;
	children?: React.ReactNode;
	trackClassName?: string;
	containerClassName?: string;
}

const Bar = ({
	valuePercent,
	barClassName,
	rawValue,
	children,
	trackClassName = 'bg-grey-20',
	containerClassName,
}: BarProps) => (
	<div className={cn('flex items-center gap-4 flex-1', containerClassName)}>
		{children && <div className="max-w-[90px] text-sm">{children}</div>}
		<div
			className={cn(
				'relative flex-1 h-3 rounded-full overflow-hidden',
				trackClassName,
			)}
		>
			<div
				className={cn(
					'absolute top-0 left-0 h-full rounded-full',
					barClassName,
				)}
				style={{ width: `${valuePercent}%` }}
			/>
		</div>
		{rawValue && (
			<span className="w-fit text-xs text-grey-800 text-right">{rawValue}</span>
		)}
	</div>
);

interface RatingSectionProps {
	overallRating: number;
	totalReviewCount: number;
	ratings: {
		foodPercent: number;
		cleanPercent: number;
		servicePercent: number;
		foodValue: number;
		cleanValue: number;
		serviceValue: number;
	};
}

const RatingSection = ({
	overallRating,
	totalReviewCount,
	ratings,
}: RatingSectionProps) => (
	<div className="flex gap-8 justify-around">
		<div className="flex flex-col items-center gap-1 justify-center">
			<span className="text-xs text-grey-600 text-center">
				<b>{totalReviewCount}</b>개 리뷰 평점
			</span>
			<div className="flex items-center gap-2">
				<Icon
					name={'Star'}
					className="fill-primary-40 text-primary-40 w-10 h-10"
				/>
				<span className="text-3xl font-bold">{overallRating.toFixed(1)}</span>
			</div>
		</div>

		<div className="flex flex-col gap-2 flex-1">
			<Bar
				valuePercent={ratings.foodPercent}
				barClassName="bg-primary-40"
				rawValue={`${ratings.foodValue.toFixed(1)}점`}
			>
				<div className="grow-1 w-10">음식</div>
			</Bar>
			<Bar
				valuePercent={ratings.servicePercent}
				barClassName="bg-sub-orange-50"
				rawValue={`${ratings.serviceValue.toFixed(1)}점`}
			>
				<div className="grow-1 w-10">청결</div>
			</Bar>
			<Bar
				valuePercent={ratings.cleanPercent}
				barClassName="bg-sub-green-50"
				rawValue={`${ratings.cleanValue.toFixed(1)}점`}
			>
				<div className="grow-1 w-10">서비스</div>
			</Bar>
		</div>
	</div>
);

interface SatisfactionSectionProps {
	distribution: {
		high: number;
		mid: number;
		low: number;
	};
}

const colors = {
	high: 'bg-grey-50',
	mid: 'bg-grey-50',
	low: 'bg-grey-50',
};

const SatisfactionSection = ({ distribution }: SatisfactionSectionProps) => {
	const total = distribution.high + distribution.mid + distribution.low;

	const maxKey = (['high', 'mid', 'low'] as const).reduce(
		(acc, key) => (distribution[key] > distribution[acc] ? key : acc),
		'high',
	);

	colors[maxKey] = 'bg-grey-90';

	//가중 평균
	const avgSatisfaction =
		total === 0
			? 0
			: (distribution.high * 85 +
					distribution.mid * 54.5 +
					distribution.low * 19.5) /
				total;

	return (
		<div className="w-full flex flex-col gap-2">
			<Typography as="h3">가격에 비해 만족스럽나요?</Typography>
			<div className="flex mt-2 justify-around items-center gap-2">
				<div className="flex flex-col items-center w-[94px] h-[86px] py-3 rounded-2xl shrink-0 bg-grey-10">
					<Typography as="h6" className="text-grey-70">
						평균 가심비
					</Typography>
					<span className="text-3xl font-bold">
						<span className="text-primary-40">
							{avgSatisfaction.toFixed(1)}
						</span>
						점
					</span>
				</div>
				<div className="flex flex-col gap-2 flex-1 text-sm text-nowrap">
					<Bar
						valuePercent={distribution.high}
						barClassName={colors.high}
						rawValue={`${distribution.high}%`}
						trackClassName="h-2 bg-grey-20"
					>
						<div className="flex gap-1 w-30">
							<span className="text-xs">만족해요</span>
							<span className="text-[9px] text-grey-60">100~70</span>
						</div>
					</Bar>
					<Bar
						valuePercent={distribution.mid}
						barClassName={colors.mid}
						rawValue={`${distribution.mid}%`}
						trackClassName="h-2 bg-grey-20"
					>
						<div className="flex gap-1 w-30">
							<span className="text-xs">보통이에요</span>
							<span className="text-[9px] text-grey-60">69~40</span>
						</div>
					</Bar>
					<Bar
						valuePercent={distribution.low}
						barClassName={colors.low}
						rawValue={`${distribution.low}%`}
						trackClassName="h-2 bg-grey-20 "
					>
						<div className="flex gap-1 w-30">
							<span className="text-xs">아쉬워요</span>
							<span className="text-[9px] text-grey-60">39~0</span>
						</div>
					</Bar>
				</div>
			</div>
		</div>
	);
};

export const ReviewStatisticsWidget = ({ storeId }: { storeId: StoreId }) => {
	const { data, isLoading, error } = useReviewStatistics(storeId);

	if (isLoading) return <div className="p-4">통계 정보를 불러오는 중...</div>;
	if (error) return <div className="p-4 text-red-500">오류: {error}</div>;
	if (!data) return null;

	const ratingsInPercent = {
		foodPercent: (data.tooltipRatings.foodRating / 5) * 100,
		servicePercent: (data.tooltipRatings.serviceRating / 5) * 100,
		cleanPercent: (data.tooltipRatings.cleanRating / 5) * 100,
		foodValue: data.tooltipRatings.foodRating,
		serviceValue: data.tooltipRatings.serviceRating,
		cleanValue: data.tooltipRatings.cleanRating,
	};

	const satisfactionDistribution = {
		high: data.satisfactionDistribution.highRange,
		mid: data.satisfactionDistribution.midRange,
		low: data.satisfactionDistribution.lowRange,
	};

	return (
		<div className="flex flex-col gap-4 py-4 px-6">
			<RatingSection
				overallRating={data.overallRating}
				totalReviewCount={data.totalReviewCount}
				ratings={ratingsInPercent}
			/>
			<hr className="border-grey-20" />
			<SatisfactionSection distribution={satisfactionDistribution} />
		</div>
	);
};
