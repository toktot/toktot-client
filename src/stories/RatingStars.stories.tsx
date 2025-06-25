// shared/components/RatingStars.stories.tsx

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import RatingStars from '../shared/components/RatingStars';

const meta: Meta<typeof RatingStars> = {
  title: 'Shared/RatingStars',
  component: RatingStars,
  tags: ['autodocs'],
  argTypes: {
  category: {
    control: { type: 'select' },
    options: ['음식', '서비스', '청결'],
  },
  size: {
    control: { type: 'radio' },
    options: ['default', 'large'],
  },
  onChange: { action: 'changed' },
  // rating: ❌ 제거
  }
  }


export default meta;
type Story = StoryObj<typeof RatingStars>;

// 상태를 갖는 Wrapper 컴포넌트
const Wrapper = (args: Omit<React.ComponentProps<typeof RatingStars>, 'onChange'>) => {
  const [rating, setRating] = useState(args.rating || 0);
  return <RatingStars {...args} rating={rating} onChange={setRating} />;
};

export const Default: Story = {
  render: (args) => <Wrapper {...args} />,
  args: {
    category: '음식',
    rating: [0, 0, 0, 0, 0], // ✅ 배열로 명확히 지정
  },
};

export const ServiceCategory: Story = {
  render: (args) => <Wrapper {...args} />,
  args: {
    category: '서비스',
    rating: [1, 1, 1, 0.5, 0], // 원하는 초기 값
  },
};

export const CleanCategory: Story = {
  render: (args) => <Wrapper {...args} />,
  args: {
    category: '청결',
    rating: [1, 1, 1, 1, 1],
  },
};
