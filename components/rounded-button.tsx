import type { ButtonHTMLAttributes, ReactNode } from "react";

type RoundedButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "soft";
};

export function RoundedButton({
  children,
  variant = "primary",
  className = "",
  disabled,
  ...props
}: RoundedButtonProps) {
  const colors = disabled
    ? "cursor-not-allowed bg-[#DDD6CC] text-[#8C8175] hover:bg-[#DDD6CC]"
    : variant === "soft"
      ? "bg-[#F9AFC9] text-[#503E2A] hover:bg-[#F59BBC]"
      : "bg-[#FD73A4] text-white hover:bg-[#EC6294]";

  return (
    <button
      className={`btn rounded-full border-0 px-7 shadow-none transition-none disabled:opacity-100 ${colors} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
