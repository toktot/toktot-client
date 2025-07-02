// shared/components/PrimaryButton.tsx

type PrimaryButtonProps = {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
};

const PrimaryButton = ({ text, onClick, disabled = false, type="button", className="" }: PrimaryButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`w-[342px] h-[48px] rounded-[20px] font-semibold text-[18px] ${
        disabled ? "bg-grey-50 text-white" : "bg-grey-90 text-primary-50"
      } ${className}`}
    >
      {text}
    </button>
  );
};

export default PrimaryButton;
