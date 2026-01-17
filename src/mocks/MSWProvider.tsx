'use client';

import { useEffect, useState } from 'react';

export const MSWProvider = ({ children }: { children: React.ReactNode }) => {
	const [mswReady, setMswReady] = useState(false);

	useEffect(() => {
		const init = async () => {
			if (typeof window !== 'undefined') {
				if (process.env.NODE_ENV === 'development') {
					const { worker } = await import('./browser');
					await worker.start({
						onUnhandledRequest: 'bypass',
					});
					setMswReady(true);
				} else {
					setMswReady(true);
				}
			}
		};

		init();
	}, []);

	if (!mswReady) {
		return null; // or a loading spinner
	}

	return <>{children}</>;
};
