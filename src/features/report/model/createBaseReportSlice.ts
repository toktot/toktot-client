import { StateCreator } from 'zustand';

import { KeywordId } from '@/shared/model/types';

export interface BaseReportState {
	selectedReasonIds: Set<KeywordId>;
	detailedContent: string;
	isPrivacyAgreed: boolean;
	isSubmitting: boolean;
}

export interface BaseReportActions {
	toggleReason: (reasonId: KeywordId) => void;
	setDetailedContent: (content: string) => void;
	setPrivacyAgreed: (agreed: boolean) => void;
	_setIsSubmitting: (isSubmitting: boolean) => void;
	_clearBaseState: () => void;
}

const createBaseInitialState = (): BaseReportState => ({
	selectedReasonIds: new Set(),
	detailedContent: '',
	isPrivacyAgreed: false,
	isSubmitting: false,
});

export const createBaseReportSlice: StateCreator<
	BaseReportState & BaseReportActions
> = (set) => ({
	...createBaseInitialState(),
	toggleReason: (reasonId) =>
		set((state) => {
			const next = new Set(state.selectedReasonIds);
			if (next.has(reasonId)) {
				next.delete(reasonId);
			} else {
				next.add(reasonId);
			}
			return { selectedReasonIds: next };
		}),
	setDetailedContent: (content) => set({ detailedContent: content }),
	setPrivacyAgreed: (agreed) => set({ isPrivacyAgreed: agreed }),
	_setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
	_clearBaseState: () => set(createBaseInitialState()),
});
