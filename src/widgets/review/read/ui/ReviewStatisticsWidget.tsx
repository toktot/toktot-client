import { ReviewStatisticsServer } from '@/entities/review/api/statisticsSchema';

import { useReviewStatistics } from '@/features/review/read/hooks/useReviewStatistics';

import { StoreId } from '@/shared/model/types';
import Typography from '@/shared/ui/Typography';

const Bar = ({
	value,
	color,
	label,
}: {
	value: number;
	color: string;
	label: string;
}) => (
	<div className="flex items-center gap-2">
		<span className="w-10 text-xs text-grey-600">{label}</span>
		<div className="relative w-full h-2 bg-grey-200 rounded-full overflow-hidden">
			<div
				className={`absolute h-full rounded-full ${color}`}
				style={{ width: `${value}%` }}
			/>
		</div>
	</div>
);

const RatingSection = ({ stats }: { stats: ReviewStatisticsServer }) => (
	<div className="flex items-center gap-6">
		<div className="flex flex-col items-center">
			<span className="text-3xl font-bold text-primary-50">
				{stats.overallRating.toFixed(1)}
			</span>
			<span className="text-xs text-grey-600">
				({stats.totalReviewCount}개)
			</span>
		</div>
		<div className="flex flex-col gap-2 w-full">
			<Bar
				value={(stats.tooltipRatings.foodRating / 5) * 100}
				color="bg-blue-400"
				label="음식"
			/>
			<Bar
				value={(stats.tooltipRatings.serviceRating / 5) * 100}
				color="bg-orange-400"
				label="서비스"
			/>
			<Bar
				value={(stats.tooltipRatings.cleanRating / 5) * 100}
				color="bg-green-400"
				label="청결"
			/>
		</div>
	</div>
);

const SatisfactionSection = ({ stats }: { stats: ReviewStatisticsServer }) => (
	<div className="w-1/2">
		<Typography as="h3">가격에 비해 만족스럽나요?</Typography>
		<div className="flex flex-col gap-2 text-nowrap">
			<Bar
				value={stats.satisfactionDistribution.highRange}
				color="bg-blue-400"
				label="만족해요"
			/>
			<Bar
				value={stats.satisfactionDistribution.midRange}
				color="bg-orange-400"
				label="보통이에요"
			/>
			<Bar
				value={stats.satisfactionDistribution.lowRange}
				color="bg-green-400"
				label="아쉬워요"
			/>
		</div>
	</div>
);

export const ReviewStatisticsWidget = ({ storeId }: { storeId: StoreId }) => {
	const { data, isLoading, error } = useReviewStatistics(storeId);

	if (isLoading) return <div className="p-4">통계 정보를 불러오는 중...</div>;
	if (error) return <div className="p-4 text-red-500">오류: {error}</div>;
	if (!data) return null;

	return (
		<div className="flex flex-col gap-4 p-4">
			<RatingSection stats={data} />
			<hr className="border-grey-20" />
			<SatisfactionSection stats={data} />
		</div>
	);
};
