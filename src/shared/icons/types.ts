export type TSizeName = 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';

export type TSizeReturnType = {
	[key in TSizeName]: {
		width: number;
		height: number;
	};
};
