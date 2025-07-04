"use client";
import Icon from "@/widgets/Icon";
type QuantitySelectorWithLabelProps = {
  value: number;
  onChange: (value: number) => void;
};

export default function QuantitySelector({
  value,
  onChange,
}: QuantitySelectorWithLabelProps) {
  const handleDecrease = () => {
    if (value > 1) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    onChange(Number(value) + 1);
  };

  return (
      <div className="w-[132px] h-[62px] rounded-[10px] px-[20px] border bg-grey-10 flex items-center justify-between text-grey-90 text-xl font-bold">
        <Icon name={"Minus"} size="m" className="w-4 h-4 cursor-pointer text-grey-50" onClick={handleDecrease} />
        <span className="text-2xl font-bold text-center w-[40px]">{value}</span>
        <Icon name={"Plus"} size="m" className="w-5 h-5 cursor-pointer text-grey-50" onClick={handleIncrease} />
      </div>
    
  );
}


