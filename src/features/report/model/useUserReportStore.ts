import { USER_REPORT_REASON_MAP } from '@/entities/report/config/reasons';
import { create } from 'zustand';

import { createReportApi } from '@/features/report/api/api';
import {
	BaseReportActions,
	BaseReportState,
	createBaseReportSlice,
} from '@/features/report/model/baseReportSlice';

import { createAuthApi } from '@/shared/api';
import { UserId } from '@/shared/model/types';
import { getDecryptedToken } from '@/shared/utils/storage';

interface UserReportState {
	targetUserId: UserId | null;
	targetNickname: string;
}

interface UserReportActions {
	initialize: (userId: UserId, nickname: string) => void;
	submit: () => Promise<boolean>;
}

type UserReportStore = BaseReportState &
	BaseReportActions &
	UserReportState &
	UserReportActions;

const initialTargetState: UserReportState = {
	targetUserId: null,
	targetNickname: '',
};

const api = createReportApi(
	createAuthApi({
		getToken: () => getDecryptedToken() ?? undefined,
	}),
);

export const isUserReportSubmitEnabled = (state: UserReportStore): boolean => {
	return (
		state.targetUserId !== null &&
		state.selectedReasonIds.size > 0 &&
		state.isPrivacyAgreed
	);
};

export const useUserReportStore = create<UserReportStore>()(
	(set, get, store) => ({
		...createBaseReportSlice(set, get, store),
		...initialTargetState,

		initialize: (userId, nickname) => {
			get()._clearBaseState();
			set({
				...initialTargetState,
				targetUserId: userId,
				targetNickname: nickname,
			});
		},

		submit: async () => {
			const state = get();
			if (
				!state.targetUserId ||
				state.selectedReasonIds.size === 0 ||
				!state.isPrivacyAgreed
			) {
				alert('필수 항목을 모두 입력해주세요.');
				return false;
			}

			state._setIsSubmitting(true);
			try {
				const payload = {
					reported_user_id: Number(state.targetUserId),
					report_types: Array.from(state.selectedReasonIds).map(
						(id) => USER_REPORT_REASON_MAP.get(id)!.apiValue,
					),
					privacy_consent: state.isPrivacyAgreed,
					other_reason: state.detailedContent,
				};
				await api.submitUserReport(payload);
				get().initialize(0 as UserId, ''); // 성공 시 초기화
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
