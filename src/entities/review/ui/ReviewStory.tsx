import React from 'react';

import { ReviewView } from '@/entities/review/model/view';

interface ReviewStoryProps {
	// 리뷰 데이터 전체를 받습니다.
	post: ReviewView;

	// 자식 컴포넌트나 다른 피처들을 주입받기 위한 슬롯입니다.
	// React.ReactNode 타입을 사용하여 어떤 리액트 요소든 받을 수 있습니다.
	infoLayer?: React.ReactNode;
	interactiveLayer?: React.ReactNode;
}

export function ReviewStory({
	post,
	infoLayer,
	interactiveLayer,
}: ReviewStoryProps) {
	console.log('🚀 ~ ReviewStory ~ post:', post);
	// 현재는 post 데이터를 직접 사용하지 않지만,
	// 향후 배경 이미지 등을 설정할 때 사용할 수 있습니다.
	// 예: const backgroundImage = post.images[0]?.url;

	return (
		<div
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				color: 'white',
			}}
		>
			{/*
        이곳이 이 컴포넌트의 핵심입니다.
        자신은 레이아웃만 잡고, 실제 내용은 외부에서 주입받은 슬롯으로 채웁니다.
      */}

			{/* 상단 정보 영역 (e.g., 프로필, 메뉴 버튼 등) */}
			<div
				style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}
			>
				{infoLayer}
			</div>

			{/*
        중앙 인터랙션 영역 (e.g., 이미지 페이징, 제스처 감지 등)
        이 영역이 대부분의 공간을 차지하며, 핵심 인터랙션이 일어납니다.
      */}
			<div style={{ flex: 1, position: 'relative' }}>{interactiveLayer}</div>
		</div>
	);
}
