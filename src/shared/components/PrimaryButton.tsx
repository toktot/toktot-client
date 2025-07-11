// shared/components/PrimaryButton.tsx

type PrimaryButtonProps = {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  textColorWhenEnabled?: string;
  bgColorWhenEnabled?: string;
};

const PrimaryButton = ({ text, onClick, disabled = false, type="button", className="", textColorWhenEnabled = "text-primary-50", bgColorWhenEnabled="bg-grey-90" }: PrimaryButtonProps) => {
  const baseClass = `h-[48px] rounded-[20px] font-semibold text-[18px]`;
  const enabledClass = `${bgColorWhenEnabled} ${textColorWhenEnabled}`;
  const disabledClass = "bg-grey-50 text-white";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`${baseClass} ${disabled ? disabledClass : enabledClass} ${className}`}
    >
      {text}
    </button>
  );
};

export default PrimaryButton;
