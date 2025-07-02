// TextInputWithLabel.tsx
import { forwardRef } from "react";

export type TextInputWithLabelProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  inputClassName?: string;
  labelClassName?: string;
};

const TextInputWithLabel = forwardRef<HTMLInputElement, TextInputWithLabelProps>(
  (
    {
      label,
      value,
      onChange,
      placeholder = "",
      type = "text",
      inputClassName = "",
      labelClassName = "",
    },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-[10px] w-[296px] h-[62px]">
        <label className={`text-sm font-medium ${labelClassName}`}>{label}</label>
        <input
          ref={ref}
          type={type}
          maxLength = {15}
          className={`
            rounded-[10px] 
            pt-[17px] pr-[20px] pb-[17px] pl-[20px] 
            border border-[#ccc] 
            text-[#4A5361] 
            focus:border-[#38DEFF] focus:text-[#38DEFF] 
            outline-none w-full
            ${inputClassName}
          `}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    );
  }
);

TextInputWithLabel.displayName = "TextInputWithLabel";

export default TextInputWithLabel;

