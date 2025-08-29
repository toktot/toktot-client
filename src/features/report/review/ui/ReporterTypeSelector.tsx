'use client';

import { ReporterType } from '@/entities/report/config/reasons';
import clsx from 'clsx';

import { Label } from '@/shared/components/Label';
import SingleCategorySelect from '@/shared/ui/SingleCategorySelect';

import { useReviewReportStore } from '../../model/useReviewReportStore';

const REPORTER_TYPE_OPTIONS: {
	label: string;
	value: ReporterType;
	id: number;
}[] = [
	{ label: '일반 고객', value: 'CUSTOMER', id: 0 },
	{ label: '매장 관계자', value: 'RESTAURANT_OWNER', id: 1 },
];

const ID_TO_VALUE_MAP = new Map(
	REPORTER_TYPE_OPTIONS.map((opt) => [opt.id, opt.value]),
);
const VALUE_TO_ID_MAP = new Map(
	REPORTER_TYPE_OPTIONS.map((opt) => [opt.value, opt.id]),
);

export const ReporterTypeSelector = () => {
	const reporterType = useReviewReportStore((state) => state.reporterType);
	const setReporterType = useReviewReportStore(
		(state) => state.setReporterType,
	);
	const selectedId = VALUE_TO_ID_MAP.get(reporterType) ?? null;

	const handleChange = (id: number) => {
		const newValue = ID_TO_VALUE_MAP.get(id);
		if (newValue) {
			setReporterType(newValue);
		}
	};

	return (
		<section className="w-full space-y-3">
			<Label>
				<div className="flex gap-3">
					<h3 className="text-lg font-semibold">신고자 정보</h3>
					<span className="bg-grey-10 text-primary-50 px-1.5 py-1 rounded-[10px]">
						필수
					</span>
				</div>
			</Label>
			<SingleCategorySelect
				value={selectedId}
				onChange={handleChange}
				className="flex-nowrap flex-col items-start gap-x-[0px]"
			>
				{REPORTER_TYPE_OPTIONS.map((opt) => (
					<SingleCategorySelect.Item
						key={opt.value}
						value={opt.id}
						className="border-none flex gap-2 items-center px-0 bg-transparent text-grey-60"
					>
						{(isActive) => (
							<>
								<div
									className={clsx(
										'w-3 h-3 rounded-full border-2 flex items-center justify-center',
										isActive
											? 'border-primary-50 bg-primary-10'
											: 'border-grey-30 hover:border-grey-50',
									)}
								>
									{isActive && (
										<div className="w-1.5 h-1.5 rounded-full bg-primary-50"></div>
									)}
								</div>
								{opt.label}
							</>
						)}
					</SingleCategorySelect.Item>
				))}
			</SingleCategorySelect>
		</section>
	);
};
