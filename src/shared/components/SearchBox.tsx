// shared/components/SearchBox.tsx
import Image from "next/image";

interface Props {
  query: string;
  onChange: (value: string) => void;
  onSearchClick: () => void;
}

export default function SearchBox({ query, onChange, onSearchClick }: Props) {
  const isFilled = query.trim().length > 0;

  return (
    <div className="relative w-[343px] mx-auto transition-all duration-300">
      <button
        type="button"
        onClick={onSearchClick}
        className={`absolute top-1/2 -translate-y-1/2 transition-all z-10 ${
          isFilled ? "right-4" : "left-4"
        }`}
      >
        <Image src="/search.svg" alt="검색" width={20} height={20} />
      </button>
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-[44px] pl-10 pr-10 py-[11px] rounded-[18px] border text-sm outline-none transition-all
          ${isFilled ? "text-[#21A8F1] border-[#21A8F1]" : "text-[#4A5361] border-[#ccc]"}`}
      />
    </div>
  );
}
