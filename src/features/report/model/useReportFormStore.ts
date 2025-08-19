import { REPORT_REASON_MAP } from '@/entities/report/config/reasons';
import { enableMapSet } from 'immer';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createAuthApi } from '@/shared/api';
import { KeywordId } from '@/shared/model/types';
import { getDecryptedToken } from '@/shared/utils/storage';

import { createReportApi } from '../api/api';

enableMapSet();

type ReportTargetType = 'user' | 'post';

interface ReportFormState {
	targetType: ReportTargetType | null;
	targetId: number | null;
	targetNickname: string;
	selectedReasonIds: Set<KeywordId>;
	detailedContent: string;
	isPrivacyAgreed: boolean;
	isSubmitting: boolean;
}

interface ReportFormActions {
	initialize: (type: ReportTargetType, id: number, nickname: string) => void;
	toggleReason: (reasonId: KeywordId) => void;
	setDetailedContent: (content: string) => void;
	setPrivacyAgreed: (agreed: boolean) => void;
	submitReport: () => Promise<boolean>;
	clearState: () => void;
}

const initialState: ReportFormState = {
	targetType: null,
	targetId: null,
	targetNickname: '',
	selectedReasonIds: new Set(),
	detailedContent: '',
	isPrivacyAgreed: false,
	isSubmitting: false,
};

export const isSubmitEnabled = (state: ReportFormState): boolean => {
	return (
		state.targetId !== null &&
		state.selectedReasonIds.size > 0 &&
		state.isPrivacyAgreed
	);
};

export const useReportFormStore = create<ReportFormState & ReportFormActions>()(
	immer((set, get) => ({
		...initialState,

		initialize: (type, id, nickname) => {
			set({
				...initialState,
				targetType: type,
				targetId: id,
				targetNickname: nickname,
			});
		},

		toggleReason: (reasonId) =>
			set((state) => {
				if (state.selectedReasonIds.has(reasonId)) {
					state.selectedReasonIds.delete(reasonId);
				} else {
					state.selectedReasonIds.add(reasonId);
				}
			}),

		setDetailedContent: (content) => set({ detailedContent: content }),
		setPrivacyAgreed: (agreed) => set({ isPrivacyAgreed: agreed }),
		clearState: () => set(initialState),

		submitReport: async () => {
			const state = get();
			if (!isSubmitEnabled(state) || !state.targetId) {
				console.error('Submit validation failed', state);
				return false;
			}

			// 개인정보 동의 체크 필수
			if (!state.isPrivacyAgreed) {
				alert('개인정보 수집에 동의해야 합니다.');
				return false;
			}

			set({ isSubmitting: true });

			try {
				const api = createReportApi(
					createAuthApi({
						getToken: () => getDecryptedToken() ?? undefined,
					}),
				);

				const payload = {
					reported_user_id: state.targetId,
					report_types: Array.from(state.selectedReasonIds).map(
						(reasonId) => REPORT_REASON_MAP.get(reasonId)!.apiValue,
					),
					privacy_consent: state.isPrivacyAgreed,
					other_reason: state.detailedContent,
				};

				await api.submitUserReport(payload);
				get().clearState(); // 성공 시 상태 초기화
				return true;
			} catch (error) {
				console.error('Report submission failed:', error);
				alert(
					error instanceof Error ? error.message : '신고 제출에 실패했습니다.',
				);
				return false;
			} finally {
				set({ isSubmitting: false });
			}
		},
	})),
);
