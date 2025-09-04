import { IconName } from '@/shared/icons/iconMap';

export type ServerMealTime = 'BREAKFAST' | 'LUNCH' | 'DINNER';

export const MEAL_TIME_MAP: Record<
  ServerMealTime,
  { text: string; icon: IconName }
> = {
  BREAKFAST: { text: '아침', icon: 'breakfast' },
  LUNCH: { text: '점심', icon: 'lunch' },
  DINNER: { text: '저녁', icon: 'dinner' }, 
};
