import React from 'react';

interface ReviewStoryProps {
	// post: ReviewView;
	infoLayer?: React.ReactNode;
	interactiveLayer?: React.ReactNode;
}

export function ReviewStory({
	// post,
	infoLayer,
	interactiveLayer,
}: ReviewStoryProps) {
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
