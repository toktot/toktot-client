import React from 'react';
import classNames from 'classnames';

type Category = '음식' | '서비스' | '청결';

interface Props {
  selected: Category;
  onSelect: (category: Category) => void;
}

const allCategories: Category[] = ['음식', '서비스', '청결'];

export default function CategorySelector({ selected, onSelect }: Props) {
  
  return (
    <div className="flex gap-2">
      {allCategories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={classNames(
            'px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200',
            category === selected
              ? 'bg-[#171D29] text-[#F6F9FB] border-[#171D29]'
              : 'bg-[#F6F9FB] text-[#171D29] border-[#d4d4d4]'
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
