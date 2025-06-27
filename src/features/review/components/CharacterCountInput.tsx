import { useId } from "react";
import classNames from "classnames";

type CharacterCountInputProps = {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
};

const CharacterCountInput = ({
  value,
  onChange,
  maxLength = 100,
  placeholder = "",
}: CharacterCountInputProps) => {
  const id = useId();

  const isOverLimit = value.length > maxLength;
  const isFilled = value.length > 0 && !isOverLimit;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="font-semibold text-[16px]">
        상세 리뷰
      </label>

      <div className="relative">
        <textarea
          id={id}
          maxLength={maxLength + 50} // 초과 감지를 위해 약간 여유를 둠
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={classNames(
            "w-[343px] h-[140px] min-w-[343px] min-h-[120px] px-5 py-4 rounded-[10px] resize-none font-pretendard text-[16px] leading-[1.5] outline-none",
            isOverLimit
              ? "border border-[#FF2626] text-[#FF2626] placeholder-[#FF2626]"
              : isFilled
              ? "border border-[#67E6FF] text-[#171D29] placeholder-[#4A5361]"
              : "border border-transparent text-[#171D29] placeholder-[#4A5361]",
            "bg-[#F6F9FB]"
          )}
        />
        <div
          className={classNames(
            "absolute bottom-3 right-4 text-[14px]",
            isOverLimit
              ? "text-[#FF2626]"
              : isFilled
              ? "text-[#1AA96E]"
              : "text-[#9AA3AF]"
          )}
        >
          <span className={isOverLimit ? "text-[#FF2626]" : "text-[#000000]"}>
            {Math.min(value.length, maxLength)}
          </span>
          /{maxLength}
        </div>
      </div>

      {isOverLimit && (
        <p className="text-[#FF2626] text-sm mt-1">
          글자수 초과시 인풋박스 안 텍스트 입니다.글자수 초과시 인풋박스 안 텍스트 입니다.글자수 초과시 인풋박스 안 텍스트 입니다.
        </p>
      )}
    </div>
  );
};

export default CharacterCountInput;
