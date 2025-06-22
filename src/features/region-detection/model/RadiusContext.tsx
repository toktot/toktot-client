import { ReactNode, createContext, useContext, useState } from 'react';

import { DEFAULT_RANGE } from './constants';
import { RangeStep } from './types';

const RadiusContext = createContext<{
	radius: RangeStep;
	setRadius: (v: RangeStep) => void;
} | null>(null);

export const RadiusProvider = ({ children }: { children: ReactNode }) => {
	const [radius, setRadius] = useState<RangeStep>(DEFAULT_RANGE);
	return (
		<RadiusContext.Provider value={{ radius, setRadius }}>
			{children}
		</RadiusContext.Provider>
	);
};

export const useRadius = () => {
	const context = useContext(RadiusContext);
	if (!context) throw new Error('useRadius must be used inside RadiusProvider');
	return context;
};
