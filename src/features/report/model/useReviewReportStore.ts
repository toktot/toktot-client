import {
	REVIEW_REPORT_REASON_MAP,
	ReporterType,
} from '@/entities/report/config/reasons';
import { create } from 'zustand';

import { createReportApi } from '@/features/report/api/api';
import {
	BaseReportActions,
	BaseReportState,
	createBaseReportSlice,
} from '@/features/report/model/createBaseReportSlice';

import { createAuthApi } from '@/shared/api';
import { ReviewId } from '@/shared/model/types';
import { getDecryptedToken } from '@/shared/utils/storage';

// --- 타입 정의 ---
interface ReviewReportState {
	reviewId: ReviewId | null;
	reporterType: ReporterType;
}

interface ReviewReportActions {
	initialize: (reviewId: ReviewId) => void;
	setReporterType: (type: ReporterType) => void;
	submitReport: () => Promise<boolean>;
}

type ReviewReportStore = BaseReportState &
	BaseReportActions &
	ReviewReportState &
	ReviewReportActions;

const initialTargetState: ReviewReportState = {
	reviewId: null,
	reporterType: 'CUSTOMER',
};

const api = createReportApi(
	createAuthApi({
		getToken: () => getDecryptedToken() ?? undefined,
	}),
);

export const isReviewReportSubmitEnabled = (
	state: ReviewReportStore,
): boolean => {
	return (
		state.reviewId !== null &&
		state.selectedReasonIds.size > 0 &&
		state.isPrivacyAgreed
	);
};

// --- 스토어 생성 ---
export const useReviewReportStore = create<ReviewReportStore>()(
	(set, get, store) => ({
		...createBaseReportSlice(set, get, store),
		...initialTargetState,

		initialize: (reviewId: ReviewId) => {
			get()._clearBaseState();
			set({ ...initialTargetState, reviewId });
		},

		setReporterType: (type: ReporterType) => set({ reporterType: type }),

		submitReport: async () => {
			const state = get();
			if (state.selectedReasonIds.size === 0 || !state.isPrivacyAgreed) {
				alert('필수 항목을 모두 입력해주세요.');
				return false;
			}

			state._setIsSubmitting(true);
			try {
				const payload = {
					review_id: Number(state.reviewId!),
					reporter_type: state.reporterType,
					report_types: Array.from(state.selectedReasonIds).map(
						(id) => REVIEW_REPORT_REASON_MAP.get(id)!.apiValue,
					),
					privacy_consent: state.isPrivacyAgreed,
					other_reason: state.detailedContent,
				};
				await api.submitReviewReport(payload);
				get().initialize('' as ReviewId); // 성공 시 초기화
				return true;
			} catch (error) {
				alert(
					error instanceof Error ? error.message : '신고 제출에 실패했습니다.',
				);
				return false;
			} finally {
				state._setIsSubmitting(false);
			}
		},
	}),
);
