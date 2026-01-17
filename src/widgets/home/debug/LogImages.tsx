// debug/logImages.ts
export type HasImage = { id: number; name?: string; image?: string | null };

export function logImages(label: string, items: HasImage[]) {
  console.groupCollapsed(`[img] ${label} count=${items.length}`);
  items.forEach((it, i) => {
    const src = (it.image ?? '').trim();
    const ok = src.length > 0 && src !== 'null';
    // 한 줄에 보기 좋게
    console.log(`#%d id=%s name=%s image=%s (has=%s)`, i + 1, it.id, it.name ?? '', src, ok);
  });
  console.groupEnd();
}
