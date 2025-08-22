'use client';

import { useMemo } from 'react';

import { REPORT_REASONS } from '@/entities/report/config/reasons';
import clsx from 'clsx';

import { Label } from '@/shared/components/Label';
import { KeywordId } from '@/shared/model/types';
import Icon from '@/shared/ui/Icon';
import MultiCategorySelect from '@/shared/ui/MultiCategorySelect';

import { useUserReportStore } from '../../model/useUserReportStore';

export const UserReportReasonSelector = () => {
	const selectedIdsSet = useUserReportStore((state) => state.selectedReasonIds);
	const toggleReason = useUserReportStore((state) => state.toggleReason);

	const selectedIdsArray = useMemo(
		() => Array.from(selectedIdsSet),
		[selectedIdsSet],
	);

	const handleChange = (value: number) => {
		toggleReason(value as KeywordId);
	};

	return (
		<section className="w-full space-y-3">
			<Label>
				<div className="flex gap-3">
					<h3 className="text-lg font-semibold">신고 사유</h3>
					<span className="bg-grey-10 text-primary-50 px-1.5 py-1 rounded-[10px]">
						필수
					</span>
				</div>
			</Label>
			<MultiCategorySelect
				value={selectedIdsArray}
				onChange={handleChange}
				className="flex-nowrap flex-col items-start gap-x-[0px]"
			>
				{REPORT_REASONS.map((reason) => (
					<MultiCategorySelect.Item
						key={reason.id}
						value={reason.id}
						className="border-none flex gap-2 items-center px-0 bg-transparent text-grey-60"
					>
						{(isActive) => (
							<>
								<Icon
									name={'Checkmark'}
									size="xs"
									className={clsx(
										isActive
											? 'fill-primary-20 text-primary-40'
											: 'fill-grey-30 text-white',
									)}
								/>
								{reason.label}
							</>
						)}
					</MultiCategorySelect.Item>
				))}
			</MultiCategorySelect>
		</section>
	);
};
