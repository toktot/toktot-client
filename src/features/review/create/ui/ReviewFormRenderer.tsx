'use client';

import CleanlinessReviewForm from './CleanlinessReviewForm';
import FoodReviewForm, { type FoodFormState } from './FoodReviewForm';
import ServiceReviewForm from './ServiceReviewForm';

export type ReviewFormData =
	| FoodFormState
	| { serviceData: string }
	| { cleanlinessData: string };

interface ReviewFormRendererProps {
	category: 'food' | 'service' | 'clean';
	onSubmit: (data: ReviewFormData) => void;
}

const CATEGORY_FORM_MAP = {
	food: FoodReviewForm,
	service: ServiceReviewForm,
	clean: CleanlinessReviewForm,
};

/**
 * @description 선택된 카테고리에 맞는 폼을 동적으로 렌더링하는 컴포넌트
 */
const ReviewFormRenderer = ({
	category,
	onSubmit,
}: ReviewFormRendererProps) => {
	const FormComponent = CATEGORY_FORM_MAP[category];

	if (!FormComponent) {
		return <p className="text-red-500">유효하지 않은 카테고리입니다.</p>;
	}

	return <FormComponent onSubmit={onSubmit} />;
};

export default ReviewFormRenderer;
