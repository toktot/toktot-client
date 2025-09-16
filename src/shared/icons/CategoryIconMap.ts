// src/shared/icons/categoryIconMap.ts
import * as Icons from '@/assets/icons';

// 카테고리 전용 매핑
export const foodIconMap: Record<string, keyof typeof Icons> = {
	dombe_meat_icon: 'DombeGogi',
	meat_noodle_icon: 'Googigukso', // 실제 아이콘 이름 맞게 수정
	sea_urchin_seaweed_icon: 'Seaweedsoup',
	bracken_hangover_icon: 'Gosali',
	red_tilefish_icon: 'Ogdom',
	cutlassfish_icon: 'Galchi',
	raw_fish_icon: 'RawFish',
	bing_icon: 'Bingtteok',
	omegi_icon: 'Omegitteok',
};
