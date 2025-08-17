'use client';

import React, { ReactNode } from 'react';

import { AuthProvider } from '@/features/auth/context/AuthProvider';
import { LocationProvider } from '@/features/locationsetting/components/LocationContext';

export default function ClientProviders({ children }: { children: ReactNode }) {
	return (
		<AuthProvider>
			<LocationProvider>{children}</LocationProvider>
		</AuthProvider>
	);
}
