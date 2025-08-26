'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { z } from 'zod';

import { ServingSelector } from './ServingSelector';

const foodFormSchema = z.object({
	menuName: z
		.string()
		.min(1, '메뉴 이름을 입력해주세요.')
		.max(15, '15자 이하로 입력해주세요.'),
	price: z.coerce
		.number()
		.min(1, '가격을 입력해주세요.')
		.max(999999, '6자리 이하의 숫자만 입력해주세요.'),
	serving: z.number().int().min(0, '몇 인분인지 입력해주세요.'),
});

export type FoodFormState = z.infer<typeof foodFormSchema>;

interface FoodReviewFormProps {
	onSubmit: (data: FoodFormState) => void;
}

/**
 * @description 음식 카테고리 리뷰 작성을 위한 폼 컴포넌트
 * @summary react-hook-form과 zod를 사용하여 상태 관리 및 유효성 검사를 처리합니다.
 */
const FoodReviewForm = ({ onSubmit }: FoodReviewFormProps) => {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<FoodFormState>({
		resolver: zodResolver(foodFormSchema),
		defaultValues: {
			menuName: '',
			serving: 1,
			// zod의 coerce.number()는 빈 문자열을 0으로 변환하므로, 기본값을 undefined로 설정하여 placeholder가 보이도록 함
			price: undefined,
		},
	});

	return (
		<form
			id="step-form"
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col gap-4"
		>
			<div className="flex flex-col gap-3">
				<div className="flex items-center whitespace-pre gap-3">
					<input
						id="menuName"
						{...register('menuName')}
						placeholder="음식명"
						className="w-full px-5 py-4 bg-grey-10 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
					<label
						htmlFor="menuName"
						className="block mb-1 text-lg font-semibold text-grey-80"
					>
						은/는
					</label>
				</div>
				{errors.menuName && (
					<p className="mt-1 text-xs text-red-500">{errors.menuName.message}</p>
				)}
			</div>
			<Controller
				control={control}
				name="serving"
				render={({ field }) => (
					<ServingSelector value={field.value} onChange={field.onChange} />
				)}
			/>

			<div className="flex flex-col gap-3">
				<div className="flex items-center whitespace-pre gap-3">
					<input
						id="price"
						type="text"
						inputMode="numeric"
						{...register('price', {
							setValueAs: (v) => Number(String(v).replace(/[^0-9]/g, '')),
						})}
						onBlur={(e) => {
							const value = e.target.value.replace(/[^0-9]/g, '');
							e.target.value = Number(value).toLocaleString();
						}}
						onFocus={(e) => {
							e.target.value = e.target.value.replace(/[^0-9]/g, '');
						}}
						placeholder="가격"
						className="w-48 px-5 py-4 bg-grey-10 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
					<label
						htmlFor="price"
						className="block mb-1 text-sm font-medium text-grey-80"
					>
						<b className="text-lg text-grey-90">원</b>이에요.
					</label>
				</div>
				{errors.price && (
					<p className="mt-1 text-xs text-red-500">{errors.price.message}</p>
				)}
			</div>
		</form>
	);
};

export default FoodReviewForm;
