export const tailDirectionClassMap: Record<Direction, string> = {
	'top-left':
		'absolute -bottom-3 rounded-b-lg right-3  border-l-[18px] border-t-[18px] border-transparent border-t-white',
	'top-right':
		'absolute -bottom-3 rounded-b-lg left-3  border-r-[18px] border-t-[18px] border-transparent border-t-white',
	'bottom-left':
		'absolute -top-3 rounded-t-lg right-3  border-l-[18px] border-b-[18px] border-transparent border-b-white',
	'bottom-right':
		'absolute -top-3 rounded-t-lg rounded-se-xl left-3 border-r-[18px] border-b-[18px] border-transparent border-b-white',
	'center-top':
		'absolute -bottom-3 left-1/2 -translate-x-1/2  border-l-[8px] border-r-[8px] border-t-[18px] border-transparent border-t-white',
	'center-bottom':
		'absolute -top-3 left-1/2 -translate-x-1/2  border-l-[8px] border-r-[8px] border-b-[18px] border-transparent border-b-white',
};

export type Direction =
	| 'top-left'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-right'
	| 'center-top'
	| 'center-bottom';

export function getBubbleTransformFromMarker(direction: Direction) {
	switch (direction) {
		case 'top-left':
			return 'translate(-100%, -125%)';
		case 'top-right':
			return 'translate(0%, -125%)';
		case 'bottom-left':
			return 'translate(-100%, 25%)';
		case 'bottom-right':
			return 'translate(0%, 25%)';
		case 'center-top':
			return 'translate(-50%, -135%)';
		case 'center-bottom':
			return 'translate(-50%, 35%)';
	}
}
