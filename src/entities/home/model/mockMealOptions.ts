import { IconName } from '@/shared/icons/iconMap';

export const mealOptions: {
	label: string;
	value: number;
	iconName: IconName;
}[] = [
	{ label: '아침', value: 0, iconName: 'breakfast' },
	{ label: '점심', value: 1, iconName: 'lunch' },
	{ label: '저녁', value: 2, iconName: 'dinner' },
];
