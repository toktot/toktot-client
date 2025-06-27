// TextInputWithLabel.tsx
import { forwardRef } from "react";

export type TextInputWithLabelProps = {
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
      value,
      onChange,
      placeholder = "",
      type = "text",
      inputClassName = "",
    },
    ref
  ) => {
    return (
      
        <input
          ref={ref}
          type={type}
          className={`w-[296px] h-[62px] rounded-[10px] pt-[17px] pr-[20px] pb-[17px] pl-[20px] border outline-none ${inputClassName}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
    );
  }
);

TextInputWithLabel.displayName = "TextInputWithLabel";

export default TextInputWithLabel;

