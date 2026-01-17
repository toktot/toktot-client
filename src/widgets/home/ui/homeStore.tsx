'use client';

import { useCallback, useEffect, useState } from 'react';
import { useCategories } from '@/shared/hooks/useCategories';
import api from '../lib/api';
import { CategoryItem } from './FoodIcon';
import StoreCardNew from './StoreCardNew';

interface PriceTabsProps {
  initialPrice?: number;
  initialFood?: string;
  /** 탭 선택될 때 (가격, 음식명) 콜백 */
  onChange?: (price: number, food: string) => void;

  /** 몇 개까지 보여줄지. 홈=3, 더보기= null(전부) */
  limit?: number | null;
  /** 요청 page size (기본 20, 더보기 페이지는 100로 크게) */
  pageSize?: number;
}

const priceRanges = [
  { label: '1만원 이하', value: 0 },
  { label: '1만원대', value: 10000 },
  { label: '2~3만원대', value: 20000 },
  { label: '3~5만원대', value: 30000 },
  { label: '5~7만원대', value: 50000 },
  { label: '7만원대 이상', value: 70000 },
];

interface GoodPriceStore {
  id: number;
  name: string;
  distance: string;
  main_menus: string;
  average_rating: number;
  address: string;
  review_count: number;
  is_good_price_store: boolean;
  is_local_store: boolean;
  image: string;
  image_url?: string | null; // <- snake 대응
  imageUrl?: string | null;
  point: number;
  percent?: number | undefined;
}
type ApiGoodPriceStore = Omit<GoodPriceStore, 'image' | 'percent'> & {
  image?: string | null;
  image_url?: string | null;
  imageUrl?: string | null;
  percent?: number | null;
  top_percent?: number | null;
  topPercent?: number | null;
  value_for_money_percent?: number | null;
  valueForMoneyPercent?: number | null;
};

export default function PriceTabs({
  initialPrice = 0,
  initialFood = '',
  onChange,
  limit = 3,          // 홈 기본: 3개만
  pageSize = 20,      // 기본 페이지 크기
}: PriceTabsProps) {
  const { categories } = useCategories();

  const [selectedFood, setSelectedFood] = useState<CategoryItem | null>(
    categories?.find((cat) => cat.name === initialFood) || null
  );
  const [activeTab, setActiveTab] = useState(
    priceRanges.find((p) => p.value === initialPrice) ?? priceRanges[0]
  );

  const handleSelect = (food: CategoryItem | null, price: (typeof priceRanges)[number]) => {
    setSelectedFood(food);
    setActiveTab(price);
    onChange?.(price.value, food?.name || '');
  };

  const [stores, setStores] = useState<GoodPriceStore[]>([]);
 
  const fetchStores = useCallback(
    async (priceValue: number, foodName: string) => {
      try {
        const res = await api.get('/v1/restaurants/good-price', {
          params: {
            priceRange: priceValue || 0,
            latitude: 33.4996,
            longitude: 126.5312,
            page: 0,
            size: pageSize,
          },
        });

        const meta = res?.data?.data as { content?: ApiGoodPriceStore[] } | undefined;
        const raw: ApiGoodPriceStore[] = meta?.content ?? [];

        let list: GoodPriceStore[] = raw.map((s) => ({
          id: s.id,
          name: s.name,
          distance: s.distance,
          main_menus: s.main_menus,
          average_rating: s.average_rating,
          address: s.address,
          review_count: s.review_count,
          is_good_price_store: s.is_good_price_store,
          is_local_store: s.is_local_store,
          image: (s.image ?? s.image_url ?? s.imageUrl ?? '') || '',
          point: s.point,
          percent:
            s.percent ??
            s.top_percent ??
            s.topPercent ??
            s.value_for_money_percent ??
            s.valueForMoneyPercent ??
            undefined,
          image_url: s.image_url ?? null,
          imageUrl: s.imageUrl ?? null,
        }));

        if (foodName) {
          list = list.filter((store) => store.main_menus?.includes(foodName));
        }

        const finalList =
          typeof limit === 'number' ? list.slice(0, Math.max(0, limit)) : list;

        setStores(finalList);
      } catch (err) {
        console.error('착한가게 fetch 실패:', err);
        setStores([]);
      }
    },
    [pageSize, limit]
  );
  useEffect(() => {
    fetchStores(activeTab.value, selectedFood?.name || '');
  }, [activeTab.value, selectedFood?.name, fetchStores]);

  return (
    <section>
      {/* 가격대 탭 */}
      <div className="relative mb-4 overflow-x-auto scrollbar-hide">
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-grey-20" />
        <div className="flex gap-2 flex-nowrap ">
          {priceRanges.map((range) => {
            const isActive = activeTab.label === range.label;
            return (
              <button
                key={range.label}
                className={`flex-shrink-0 relative px-4 py-2 text-[16px] font-semibold ${
                  isActive ? 'text-grey-90' : 'text-grey-40'
                }`}
                onClick={() => handleSelect(selectedFood, range)}
              >
                {range.label}
                {isActive && (
                  <span className="absolute bottom-0 left-4 w-[48px] h-[2px] bg-grey-90" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 가게 카드 리스트 */}
      <div className="flex flex-col gap-4 justify-center items-center">
        {stores.map((store) => (
          <StoreCardNew key={store.id} review={store} />
        ))}
      </div>
    </section>
  );
}
