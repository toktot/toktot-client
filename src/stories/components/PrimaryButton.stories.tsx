// shared/components/PrimaryButton.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs';

import PrimaryButton from '@/shared/components/PrimaryButton';

const meta: Meta<typeof PrimaryButton> = {
	title: 'Components/PrimaryButton',
	component: PrimaryButton,
	tags: ['autodocs'],
	argTypes: {
		onClick: { action: 'clicked' }, // 클릭 이벤트를 action으로 연결
		text: { control: 'text' },
		disabled: { control: 'boolean' },
		className: { control: 'text' },
		type: {
			control: { type: 'select' },
			options: ['button', 'submit', 'reset'],
		},
	},
};

export default meta;
type Story = StoryObj<typeof PrimaryButton>;

export const Default: Story = {
	args: {
		text: '버튼 텍스트',
		disabled: false,
		type: 'button',
		className: '',
	},
};

export const Disabled: Story = {
	args: {
		text: '비활성화 버튼',
		disabled: true,
	},
};

export const SubmitType: Story = {
	args: {
		text: '제출하기',
		type: 'submit',
	},
};
