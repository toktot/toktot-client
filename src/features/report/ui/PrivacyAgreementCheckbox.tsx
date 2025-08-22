'use client';

import clsx from 'clsx';

import { Label } from '@/shared/components/Label';
import Icon from '@/shared/ui/Icon';

interface ReportDetailInputProps {
	checked: boolean;
	onChange: (agreed: boolean) => void;
}

export const PrivacyAgreementCheckbox = ({
	checked,
	onChange,
}: ReportDetailInputProps) => {
	return (
		<section className="w-full flex flex-col gap-3">
			<Label>
				<div className="flex gap-3">
					<h3 className="text-lg font-semibold">개인정보 수집 동의</h3>
					<span className="bg-grey-10 text-primary-50 px-1.5 py-1 rounded-[10px]">
						필수
					</span>
				</div>
			</Label>
			<p className="text-grey-70 text-sm">
				수집하는 개인정보 항목 : 똑똣 아이디, 닉네임
			</p>
			<p className="text-grey-70 text-sm">
				개인정보는 문의 접수, 고객 불편 사항 확인 및 처리 결과 회신에 이용되며
				전자상거래법 등 관련 법령에 따라 1년간 보관됩니다. 이용자는 본 동의를
				거부할 수 있으나, 미동의 시 문의 접수가 불가능합니다
			</p>
			<label className="flex items-center cursor-pointer">
				<input
					type="checkbox"
					checked={checked}
					onChange={(e) => onChange(e.target.checked)}
					className="hidden text-sm"
				/>
				<div className="flex gap-3 items-center ">
					<Icon
						name={'Checkmark'}
						size="xs"
						className={clsx(
							checked
								? 'fill-primary-20 text-primary-40'
								: 'fill-grey-30 text-white',
						)}
					/>

					<span className="text-sm text-grey-85">동의합니다.</span>
				</div>
			</label>
			<div className="text-grey-70 text-sm flex flex-col gap-2 space-y-3">
				<p>
					부정 행위 리뷰어에 대한 신고만 가능합니다. <br />그 외 문의는
					개별적으로 처리 및 답변드리지 않습니다.
				</p>
				<b>신고 대상</b>
				<ul className="list-disc pl-6 space-y-2">
					<li>
						똑똣 이용정책과 리뷰 이용정책 규정을 위반한 리뷰어 리뷰어 신고 시,
						아래 내용을 반드시 참고해주세요
					</li>
					<li>
						리뷰에 대한 신고가 아닌, 리뷰어에 대한 신고만 가능합니다. 신고
						사유는 구체적으로 작성해주시기 바랍니다.
					</li>
					<li>
						사유가 불명확하거나 정보가 부족할 경우, 검토 및 조치가 어려울 수
						있습니다.
					</li>
					<li>신중한 신고 접수를 부탁드립니다.</li>
				</ul>
			</div>
		</section>
	);
};
