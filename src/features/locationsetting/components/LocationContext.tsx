'use client';

import React, { ReactNode, createContext, useContext, useState } from 'react';

interface Location {
	address: string;
	lat: number | null;
	lng: number | null;
}

interface LocationContextType {
	location: Location;
	setLocation: (loc: Location) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(
	undefined,
);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
	const [location, setLocation] = useState<Location>({
		address: '',
		lat: null,
		lng: null,
	});

	return (
		<LocationContext.Provider value={{ location, setLocation }}>
			{children}
		</LocationContext.Provider>
	);
};

export const useLocation = () => {
	const context = useContext(LocationContext);
	if (!context)
		throw new Error('useLocation must be used within LocationProvider');
	return context;
};
