import { FoodTooltip, Tooltip, TooltipCategory } from '@/entities/review';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { FinalReviewData } from '@/widgets/review/write/ui/CreateReviewSheet';

import { ReviewImageId, TooltipId } from '@/shared/model/types';

type BeginResult =
	| { ok: true; tooltipId: TooltipId }
	| { ok: false; reason: 'LIMIT_REACHED' | 'INVALID_IMAGE' };

interface ReviewWriteState {
	tooltips: Record<TooltipId, Tooltip>;
	tooltipsByImageId: Record<ReviewImageId, TooltipId[]>;
	draftTooltipId: TooltipId | null;
	valueForMoneyScore: number | null;
}

interface ReviewWriteActions {
	beginTooltipForImage: (
		imageId: ReviewImageId,
		coord: { x: number; y: number },
		maxPerImage?: number,
	) => BeginResult;

	commitTooltipDetails: (id: TooltipId, data: FinalReviewData) => void;

	cancelDraftTooltip: (id: TooltipId) => void;

	changeTooltipCategory: (id: TooltipId, category: TooltipCategory) => void;

	removeTooltipDeep: (id: TooltipId) => void;

	detachImage: (imageId: ReviewImageId) => void;

	clearAllState: () => void;

	setValueForMoneyScore: (score: number | null) => void;
}

interface ReviewWriteSelectors {
	selectTooltipsForImage: (imageId: ReviewImageId) => Tooltip[];
	buildInteractiveImages: <T extends { id: ReviewImageId }>(
		images: T[],
	) => (T & { tooltipIds: TooltipId[] })[];
	tooltips: Record<TooltipId, Tooltip>;
}

export const useReviewWriteStore = create<
	ReviewWriteState & ReviewWriteActions & ReviewWriteSelectors
>()(
	immer((set, get) => ({
		tooltips: {},
		tooltipsByImageId: {},
		draftTooltipId: null,
		valueForMoneyScore: null,

		beginTooltipForImage: (imageId, coord, maxPerImage) => {
			const { tooltipsByImageId } = get();

			if (!imageId) {
				return { ok: false, reason: 'INVALID_IMAGE' };
			}

			if (
				maxPerImage !== undefined &&
				(tooltipsByImageId[imageId]?.length || 0) >= maxPerImage
			) {
				return { ok: false, reason: 'LIMIT_REACHED' };
			}

			const id = nanoid() as TooltipId;
			const placeholder: FoodTooltip = {
				id,
				category: 'food',
				x: coord.x,
				y: coord.y,
				rating: 0,
				menuName: '',
				price: 0,
				description: '',
				servings: 1,
			};

			set((state) => {
				state.tooltips[id] = placeholder;
				if (!state.tooltipsByImageId[imageId]) {
					state.tooltipsByImageId[imageId] = [];
				}
				state.tooltipsByImageId[imageId].push(id);
				state.draftTooltipId = id;
			});

			return { ok: true, tooltipId: id };
		},

		commitTooltipDetails: (id, data) => {
			set((state) => {
				const existing = state.tooltips[id];
				if (!existing) return;

				switch (data.category) {
					case 'food':
						if (data.formData && 'menuName' in data.formData) {
							state.tooltips[id] = {
								...existing,
								category: 'food',
								rating: data.rating,
								description: data.detailedText,
								menuName: data.formData.menuName,
								price: data.formData.price,
								servings: data.formData.serving,
							};
						}
						break;
					case 'service':
						state.tooltips[id] = {
							...existing,
							category: 'service',
							rating: data.rating,
							description: data.detailedText,
						};
						break;
					case 'clean':
						state.tooltips[id] = {
							...existing,
							category: 'clean',
							rating: data.rating,
							description: data.detailedText,
						};
						break;
				}

				if (state.draftTooltipId === id) {
					state.draftTooltipId = null;
				}
			});
		},

		cancelDraftTooltip: (id) => {
			set((state) => {
				if (state.draftTooltipId === id) {
					const tooltip = state.tooltips[id];
					if (tooltip) {
						// 연결된 이미지 관계에서 제거
						for (const imageId in state.tooltipsByImageId) {
							const typedImageId = imageId as ReviewImageId;
							state.tooltipsByImageId[typedImageId] = state.tooltipsByImageId[
								typedImageId
							].filter((tid: TooltipId) => tid !== id);
							if (state.tooltipsByImageId[typedImageId].length === 0) {
								delete state.tooltipsByImageId[typedImageId];
							}
						}
						delete state.tooltips[id];
					}
					state.draftTooltipId = null;
				}
			});
		},

		changeTooltipCategory: (id, category) => {
			set((state) => {
				const existing = state.tooltips[id];
				if (!existing || existing.category === category) return;

				const base = {
					id: existing.id,
					x: existing.x,
					y: existing.y,
					rating: 0,
					description: '',
				};

				switch (category) {
					case 'food':
						state.tooltips[id] = {
							...base,
							category: 'food',
							menuName: '',
							price: 0,
							servings: 1,
						};
						break;
					case 'service':
						state.tooltips[id] = { ...base, category: 'service' };
						break;
					case 'clean':
						state.tooltips[id] = { ...base, category: 'clean' };
						break;
				}
			});
		},

		removeTooltipDeep: (id) => {
			set((state) => {
				delete state.tooltips[id];
				for (const imageId in state.tooltipsByImageId) {
					const typedImageId = imageId as ReviewImageId;
					state.tooltipsByImageId[typedImageId] = state.tooltipsByImageId[
						typedImageId
					].filter((tid: TooltipId) => tid !== id);
					if (state.tooltipsByImageId[typedImageId].length === 0) {
						delete state.tooltipsByImageId[typedImageId];
					}
				}
			});
		},

		detachImage: (imageId) => {
			set((state) => {
				const tooltipIds = state.tooltipsByImageId[imageId] || [];
				tooltipIds.forEach((tid) => delete state.tooltips[tid]);
				delete state.tooltipsByImageId[imageId];
			});
		},

		clearAllState: () => {
			set(() => ({
				tooltips: {},
				tooltipsByImageId: {},
				draftTooltipId: null,
				valueForMoneyScore: null,
			}));
		},

		selectTooltipsForImage: (imageId) => {
			const { tooltips, tooltipsByImageId } = get();
			const ids = tooltipsByImageId[imageId] || [];

			return ids.map((id) => tooltips[id]).filter(Boolean);
		},

		setValueForMoneyScore: (score) => {
			set({ valueForMoneyScore: score });
		},

		buildInteractiveImages: (images) => {
			const { tooltipsByImageId } = get();
			return images.map((img) => ({
				...img,
				tooltipIds: tooltipsByImageId[img.id] || [],
			}));
		},
	})),
);
