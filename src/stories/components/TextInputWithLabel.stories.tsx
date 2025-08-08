// shared/components/TextInputWithLabel.stories.tsx
import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs';

import TextInputWithLabel, {
	TextInputWithLabelProps,
} from '@/shared/components/TextInputWithLabel';

const meta: Meta<typeof TextInputWithLabel> = {
	title: 'Components/TextInputWithLabel',
	component: TextInputWithLabel,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		value: { control: 'text' },
		placeholder: { control: 'text' },
		type: {
			control: { type: 'select' },
			options: ['text', 'password', 'email', 'number'],
		},
		inputClassName: { control: 'text' },
		labelClassName: { control: 'text' },
	},
};

export default meta;
type Story = StoryObj<typeof TextInputWithLabel>;

// Wrapper 컴포넌트로 상태 제어 (Storybook에서 onChange 동작 가능하게)
const Wrapper = (args: TextInputWithLabelProps) => {
	const [value, setValue] = useState(args.value || '');

	return <TextInputWithLabel {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
	render: (args) => <Wrapper {...args} />,
	args: {
		label: '이름',
		placeholder: '이름을 입력하세요',
		type: 'text',
		value: '',
	},
};

export const PasswordInput: Story = {
	render: (args) => <Wrapper {...args} />,
	args: {
		label: '비밀번호',
		placeholder: '비밀번호 입력',
		type: 'password',
		value: '',
	},
};

export const EmailInput: Story = {
	render: (args) => <Wrapper {...args} />,
	args: {
		label: '이메일',
		placeholder: 'example@email.com',
		type: 'email',
		value: '',
	},
};
