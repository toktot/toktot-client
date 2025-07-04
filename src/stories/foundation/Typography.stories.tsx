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
		variant: {
			control: 'select',
			options: ['h1', 'h2', 'h3', 'body1', 'body2', 'caption'],
			description: '미리 정의된 텍스트 스타일',
		},
		as: {
			control: 'text',
			description: "렌더링할 HTML 태그 (예: 'h1', 'h2', 'span')",
		},
		children: {
			control: 'text',
			description: '표시될 텍스트 내용',
		},
		className: {
			control: 'text',
			description: '추가할 커스텀 CSS 클래스',
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 가장 기본적으로 사용되는 섹션 타이틀 형태입니다.
 * `variant`는 'h2'이며, `text-lg font-semibold` 스타일이 적용됩니다.
 */
export const SectionTitle: Story = {
	args: {
		variant: 'h2',
		children: 'This is a Section Title',
	},
};

/**
 * `as` prop을 사용하여 시맨틱한 h1 태그로 렌더링한 예시입니다.
 * SEO와 웹 접근성에 좋습니다.
 */
export const SemanticH1: Story = {
	args: {
		variant: 'h1',
		as: 'h1',
		children: 'This is a Semantic H1 Heading',
	},
};

/**
 * 일반적인 본문 텍스트 스타일입니다.
 */
export const BodyText: Story = {
	args: {
		variant: 'body1',
		children:
			'This is a paragraph of body text. It demonstrates the default "p" tag rendering.',
	},
};

/**
 * `className` prop을 사용하여 커스텀 스타일(예: 색상)을 추가한 예시입니다.
 */
export const WithCustomColor: Story = {
	args: {
		variant: 'h3',
		as: 'h3',
		className: 'text-blue-500',
		children: 'Custom Styled Text',
	},
};

/**
 * 사용 가능한 모든 variant를 한눈에 볼 수 있는 스토리입니다.
 * 디자인 시스템을 검토할 때 유용합니다.
 */
export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-col items-start gap-4">
			<Typography variant="h1" as="h1">
				H1 Title (2xl, bold)
			</Typography>
			<Typography variant="h2" as="h2">
				H2 Title (lg, semibold)
			</Typography>
			<Typography variant="h3" as="h3">
				H3 Title (base, semibold)
			</Typography>
			<Typography variant="body1">Body 1 (base, normal)</Typography>
			<Typography variant="body2">Body 2 (sm, normal)</Typography>
			<Typography variant="caption">Caption (xs, normal)</Typography>
		</div>
	),
};
