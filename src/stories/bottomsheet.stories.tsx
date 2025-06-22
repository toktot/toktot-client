import type { Meta, StoryObj } from '@storybook/nextjs';
import { BottomSheet } from '@/shared/components/BottomSheet'; // 경로는 실제 경로에 맞게 수정
import { useState } from 'react';

// Storybook에서 BottomSheet를 트리거하기 위한 래퍼 컴포넌트
const BottomSheetExample = () => {
  const [open, setOpen] = useState(true); // 항상 열려 있도록 설정
console.log(setOpen);
  return (
    <>
      {/* 오픈 여부 토글을 위한 버튼도 넣을 수 있음 */}
      {/* <button onClick={() => setOpen(!open)}>Toggle BottomSheet</button> */}
      {open && (
        <BottomSheet>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Bottom Sheet 내용</h2>
            <p>이곳에 원하는 내용을 넣을 수 있습니다.</p>
          </div>
        </BottomSheet>
      )}
    </>
  );
};

const meta: Meta<typeof BottomSheetExample> = {
  title: 'Example/BottomSheet',
  component: BottomSheetExample,
  parameters: {
    layout: 'fullscreen', // BottomSheet는 전체 하단에 떠야 하므로
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BottomSheetExample>;

export const Default: Story = {};
