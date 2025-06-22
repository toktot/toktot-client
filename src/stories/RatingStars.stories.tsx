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
    rating: {
      control: { type: 'number', min: 0, max: 5, step: 1 },
    },
    onChange: { action: 'changed' },
  },
};

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
    rating: 3,
    category: '음식',
  },
};

export const ServiceCategory: Story = {
  render: (args) => <Wrapper {...args} />,
  args: {
    rating: 4,
    category: '서비스',
  },
};

export const CleanCategory: Story = {
  render: (args) => <Wrapper {...args} />,
  args: {
    rating: 2,
    category: '청결',
  },
};
