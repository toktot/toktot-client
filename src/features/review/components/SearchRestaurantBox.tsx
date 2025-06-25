"use client"
import SearchBox from "@/shared/components/SearchBox";
import { useEffect, useState } from "react";

interface Props {
  query: string;
  onQueryChange: (value: string) => void;
  onSelect: (name: string) => void;
}
const restaurantList = [
  "현대식당",
  "현이네국밥",
  "한솥도시락",
  "맘스터치",
  "현미밥상",
  "현우김밥"
];

export default function SearchRestaurantBox({
  query,
  onQueryChange,
  onSelect,
}: Props) {
  const [filteredList, setFilteredList] = useState<string[]>([]);

  const updateFilteredList = () => {
    const results = restaurantList.filter((name) =>
      name.toLowerCase().startsWith(query.toLowerCase())
    );
    setFilteredList(query ? results : []);
  };

  useEffect(() => {
    updateFilteredList();
  }, [query]);

  const handleSearchClick = () => {
    updateFilteredList(); // 아이콘 눌러도 자동완성
  };

  return (
    <div className={`w-[343px] mx-auto ${query ? "mt-[25px]" : "mt-[80px]"}`}>
      <SearchBox
        query={query}
        onChange={onQueryChange}
        onSearchClick={handleSearchClick}
      />
      <ul className="mt-4 space-y-2">
        {filteredList.map((name, idx) => (
          <li
            key={idx}
            className="flex justify-between items-center px-4 py-2 rounded-md bg-white shadow border hover:bg-gray-50 cursor-pointer"
            onClick={() => onSelect(name)}
          >
            <span className="text-[#4A5361] font-medium">{name}</span>
            <span className="text-[#4A5361] text-lg">{">"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
