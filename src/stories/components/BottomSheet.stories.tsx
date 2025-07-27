import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs';

import {
	BottomSheet,
	BottomSheetContent,
	BottomSheetOverlay,
	BottomSheetTrigger,
} from '@/shared/components/BottomSheet';
import PrimaryButton from '@/shared/components/PrimaryButton';

const meta: Meta<typeof BottomSheet> = {
	title: 'Components/BottomSheet',
	component: BottomSheet,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: '컴파운드 컴포넌트 패턴으로 만들어진 유연한 바텀시트입니다.',
			},
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: '기본 사용법 (비제어)',
	render: () => (
		<div className="w-full h-screen bg-gray-100 flex items-center justify-center">
			<BottomSheet>
				<BottomSheetTrigger>
					<PrimaryButton className="w-40" text="바텀시트 열기" />
				</BottomSheetTrigger>
				<BottomSheetOverlay className="fixed inset-0 bg-black/60" />
				<BottomSheetContent className="fixed bottom-0 w-full p-6 bg-white rounded-t-2xl shadow-lg max-h-[90vh] overflow-y-auto">
					<div className="mx-auto my-3 h-1 w-6 rounded-full bg-grey-30" />
					<h2 className="text-xl font-bold mt-4">기본 바텀시트</h2>
					<p className="mt-2 text-gray-600">
						이것은 가장 기본적인 바텀시트의 사용 예시입니다.
						<br />
						배경을 클릭하거나 아래로 드래그하여 닫을 수 있습니다.
					</p>
					<div className="h-40" />
				</BottomSheetContent>
			</BottomSheet>
		</div>
	),
};

export const Controlled: Story = {
	name: '외부 상태와 연동 (제어)',
	render: () => {
		const [isOpen, setIsOpen] = useState(false);

		return (
			<div className="w-full h-screen bg-gray-100 p-8">
				<div className="flex items-center gap-4">
					<PrimaryButton
						text="외부 버튼으로 열기"
						onClick={() => setIsOpen(true)}
						className="w-60"
					/>
					<p className="text-sm text-gray-700">
						현재 상태: <strong>{isOpen ? '열림' : '닫힘'}</strong>
					</p>
				</div>

				<BottomSheet open={isOpen} onOpenChange={setIsOpen}>
					{/* Trigger는 필요하지 않습니다. */}
					<BottomSheetOverlay className="fixed inset-0 bg-black/60" />
					<BottomSheetContent className="fixed bottom-0 w-full p-6 bg-white rounded-t-2xl shadow-lg max-h-[90vh] overflow-y-auto">
						<div className="mx-auto my-3 h-1 w-6 rounded-full bg-grey-30" />
						<h2 className="text-xl font-bold mt-4">제어되는 바텀시트</h2>
						<p className="mt-2 text-gray-600">
							이 바텀시트는 부모 컴포넌트의 `useState`와 연결되어 있습니다.
						</p>
						<PrimaryButton
							text="내부 버튼으로 닫기"
							onClick={() => setIsOpen(false)}
							className="mt-4 w-60"
						/>
					</BottomSheetContent>
				</BottomSheet>
			</div>
		);
	},
};
