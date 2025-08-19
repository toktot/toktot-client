'use client';

import { REPORT_DETAIL_MAX_LENGTH } from '../config/constants';
import { useReportFormStore } from '../model/useReportFormStore';

export const ReportDetailInput = () => {
	const detailedContent = useReportFormStore((state) => state.detailedContent);
	const setDetailedContent = useReportFormStore(
		(state) => state.setDetailedContent,
	);
	const maxLength = REPORT_DETAIL_MAX_LENGTH;

	return (
		<section className="w-full space-y-3">
			<h3 className="text-lg font-semibold">상세 내용</h3>
			<div className="relative w-full">
				<textarea
					value={detailedContent}
					onChange={(e) => setDetailedContent(e.target.value)}
					placeholder="타당한 사유가 없는 허위 신고 시 이용에 제한이 가해질 수 있으므로 신중하게 접수해 주세요.
신고 내용은 7일 이내의 검수 과정을 거친 후 적용됩니다."
					maxLength={maxLength}
					className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:border-blue-500 focus:outline-none"
				/>
				<span className="absolute bottom-3 right-4 text-sm text-gray-500">
					<span className={'text-sub-green-40'}>{detailedContent.length}</span>/
					{maxLength}
				</span>
			</div>
		</section>
	);
};
