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
      <div className="space-y-1">
        <label className={`text-sm font-medium ${labelClassName}`}>{label}</label>
        <input
          ref={ref}
          type={type}
          className={`w-full border rounded px-3 py-2 outline-none ${inputClassName}`}
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

