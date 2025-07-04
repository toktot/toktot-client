// TextInputWithLabel.tsx
import { forwardRef } from "react";

export type TextInputWithLabelProps = {
  label?: string;
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
    const textColor = value.trim() !== "" ? "text-grey-90" : "text-grey-60";
    return (
      
      <div className="flex flex-col gap-[10px] w-[296px] h-[62px]">
        <label className={`text-sm font-medium text-grey-60 ${labelClassName}`}>{label}</label>
        <input
          ref={ref}
          type={type}
          maxLength = {15}
          className={`
           
            h-[38px]
            rounded-[10px] 
            pt-[17px] pr-[20px] pb-[17px] pl-[20px] 
            border border-grey-30
            text-grey-60
            bg-grey-10
            focus:border-primary-40 focus:text-primary-40
            outline-none
            placeholder:text-grey-80
            placeholder:h-[28px]
            ${textColor}
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

