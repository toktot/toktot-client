import { StoreId } from '@/shared/model/types';

export interface StoreData {
	id: StoreId;
	storeName: string;
	mainMenu: string;
	address: string;
	storeImageUrl?: string;
}
