// fetchGoodPrice.ts
import api from '@/widgets/home/lib/api';

export interface RawGoodPriceItem {
  id: number;
  name: string;
  address: string;
  distance?: string | number | null;
  main_menus?: string | null;
  average_rating?: number | null;
  review_count?: number | null;
  is_good_price_store?: boolean | null;
  is_local_store?: boolean | null;
  image?: string | null;
  image_url?: string | null;      // 스네이크
  imageUrl?: string | null;
  point?: number | null;
  percent?: string | null;
}
const pickImage = (s: RawGoodPriceItem): string => {
  const candidates = [s.image, s.image_url, s.imageUrl];
  for (const c of candidates) {
    const v = (c ?? '').trim();
    if (v && v.toLowerCase() !== 'null') return v;
  }
  return '';
};

export interface GoodPriceNormalized {
  id: number;
  name: string;
  address: string;
  distance: string;              // 포맷된 문자열
  main_menus: string;
  average_rating: number;
  review_count: number;
  is_good_price_store: boolean;
  is_local_store: boolean;
  image: string;
}

const formatDistanceRaw = (raw: string | number | null | undefined): string => {
  if (raw == null) return '';
  if (typeof raw === 'string') {
    // 서버가 "1.2km", "500m"로 주면 그대로 노출
    return raw.trim();
  }
  // 숫자로 오면 휴리스틱 포맷
  const d = Number(raw);
  if (!Number.isFinite(d)) return '';
  if (d >= 1000) return `${(d / 1000).toFixed(1)}km`;
  if (d > 0 && d < 10) return `${d.toFixed(1)}km`;
  return `${Math.round(d)}m`;
};

const extractMenus = (menus: string | null | undefined): string => {
  return menus ?? '';
};

export type FetchGoodPriceParams = {
  priceRange: number | null | undefined; // 0, 10000, 20000, ...
  latitude?: number;
  longitude?: number;
  page?: number;
  size?: number; // 1~100
};

export async function fetchGoodPriceStores(params: FetchGoodPriceParams) {
  const {
    priceRange = 0,
    latitude = 33.4996,
    longitude = 126.5312,
    page = 0,
    size = 20,
  } = params;

  const res = await api.get('/v1/restaurants/good-price', {
    params: { priceRange, latitude, longitude, page, size },
  });
  console.log('착한 가게 데이터', res.data?.data)

  const meta = res?.data?.data;
  const content: RawGoodPriceItem[] = meta?.content ?? [];

  // 🔎 상세 로그
  console.log(
    '[good-price] req',
    { priceRange, latitude, longitude, page, size },
    '→ res',
    {
      page: meta?.number,
      size: meta?.size,
      numberOfElements: meta?.numberOfElements,
      contentLength: content.length,
      totalElements: meta?.totalElements,
      totalPages: meta?.totalPages,
      last: meta?.last,
    }
  );

  const normalized: GoodPriceNormalized[] = content.map((s) => ({
    id: s.id,
    name: s.name,
    address: s.address ?? '',
    distance: formatDistanceRaw(s.distance),
    main_menus: extractMenus(s.main_menus),
    average_rating: Number(s.average_rating ?? 0),
    review_count: Number(s.review_count ?? 0),
    is_good_price_store: !!s.is_good_price_store,
    is_local_store: !!s.is_local_store,
    image: pickImage(s), 
  }));

  const withImg = normalized.filter(i => i.image).length;
  console.log('[good-price] normalized length:', normalized.length, 'withImage:', withImg);
  return { items: normalized, pageMeta: meta };
}
