import { Meta, StoryObj } from '@storybook/nextjs';

import Typography from '@/shared/typography/Typography';

const meta: Meta<typeof Typography> = {
	title: 'Components/Typography',
	component: Typography,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		as: {
			control: 'select',
			options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'strong'],
			description: '렌더링할 HTML 태그 (예: h1, h2, span 등)',
		},
		children: {
			control: 'text',
			description: '표시될 텍스트 내용',
		},
		className: {
			control: 'text',
			description: 'Tailwind CSS class를 통해 스타일 확장 가능',
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const H2Title: Story = {
	args: {
		as: 'h2',
		children: 'This is a Section Title',
		className: 'text-primary-60',
	},
};

export const H1Title: Story = {
	args: {
		as: 'h1',
		children: 'This is a Semantic H1 Heading',
	},
};

export const BodyParagraph: Story = {
	args: {
		as: 'p',
		children:
			'This is a paragraph of body text. It demonstrates the default "p" tag rendering.',
	},
};

export const AllTags: Story = {
	render: () => (
		<div className="flex flex-col items-start gap-4">
			<Typography as="h1">H1 Title (2xl, bold)</Typography>
			<Typography as="h2">H2 Title (xl, semibold)</Typography>
			<Typography as="h3">H3 Title (lg, semibold)</Typography>
			<Typography as="h4">H4 Title (base, semibold)</Typography>
			<Typography as="h5">H5 Title (sm, semibold)</Typography>
			<Typography as="h6">H6 Title (xs, semibold)</Typography>
			<Typography as="p">Paragraph (base, normal)</Typography>
			<Typography as="span">Span Text (base, normal)</Typography>
			<Typography as="strong">Strong Text (medium)</Typography>
		</div>
	),
};
