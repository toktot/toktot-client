import { Tooltip } from './tooltip';

export interface ReviewImage {
	id: string;
	url: string;
	file?: File;
	tooltips: Tooltip[];
}
