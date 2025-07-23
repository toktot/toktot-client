'use client';

import ReviewDetailSheet from '@/features/review/components/ReviewDetail';

export default function ReviewTestPage() {
	return (
		<main className="min-h-screen bg-grey-5 flex items-center justify-center px-4 py-12">
			<div className="w-full max-w-md">
				<ReviewDetailSheet onNext={() => alert('다음 단계로 이동')} />
			</div>
		</main>
	);
}
