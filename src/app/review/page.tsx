'use client';

import ReviewModal from '@/entities/review/ui/ReviewModal';

export default function ModalTestPage() {
  const images = [
    '/hamster.webp',
    '/hamster.webp',
    '/hamster.webp',
  ]; // 퍼블릭 폴더에 저장한 이미지

  return <ReviewModal images={images} onDone={() => alert('완료')} />;
}