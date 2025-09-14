'use client';

export const DevelopmentBanner = () => {
	if (process.env.NEXT_PUBLIC_APP_ENV !== 'development') {
		return null;
	}

	return (
		<div
			style={{
				position: 'fixed',
				top: '10px',
				right: '10px',
				background: 'rgba(255, 229, 100, 0.8)',
				color: '#333',
				padding: '8px 12px',
				borderRadius: '8px',
				fontSize: '14px',
				fontWeight: 'bold',
				zIndex: 9999,
				backdropFilter: 'blur(5px)',
			}}
		>
			🛠️ DEV
		</div>
	);
};
