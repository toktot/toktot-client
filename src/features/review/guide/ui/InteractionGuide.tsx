import React from 'react';

import Icon from '@/shared/ui/Icon';

interface InteractionGuideProps {
	onClose: () => void;
}

export function InteractionGuide({ onClose }: InteractionGuideProps) {
	return (
		<div
			onClick={onClose}
			className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-2  text-white animate-in fade-in duration-300"
		>
			<div className="w-96 h-40 bg-[#171D2966] rounded-2xl flex flex-col items-center gap-2 justify-center">
				<Icon name={'ArrowUpBar'} />
				<p className="font-bold">이전 리뷰 보기</p>
				<p className="text-xs">위로 스와이프</p>
			</div>
			<div className="w-96 h-40 bg-[#171D2966] rounded-2xl flex flex-col items-center gap-2 justify-center">
				<p className="font-bold">현재 리뷰의 다음 사진 보기</p>
				<p className="text-xs">중앙 터치</p>
				<div className="w-12 h-12 relative overflow-hidden">
					<div className="w-5 h-5 left-[14px] top-[14px] absolute bg-white/60 rounded-full" />
					<div className="w-7 h-7 left-[10px] top-[10px] absolute bg-white/60 rounded-full" />
				</div>
			</div>
			<div className="w-96 h-40 bg-[#171D2966] rounded-2xl flex flex-col items-center gap-2 justify-center">
				<p className="font-bold">다음 리뷰 보기</p>
				<p className="text-xs">아래로 스와이프</p>
				<Icon name={'ArrowDownBar'} />
			</div>
		</div>
	);
}
