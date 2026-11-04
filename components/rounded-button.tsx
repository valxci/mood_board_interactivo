import type { ButtonHTMLAttributes, ReactNode } from "react";

type RoundedButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "soft";
};

export function RoundedButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: RoundedButtonProps) {
  const colors =
    variant === "soft"
      ? "bg-[#F9AFC9] text-[#503E2A] hover:bg-[#F59BBC]"
      : "bg-[#FD73A4] text-white hover:bg-[#EC6294]";

  return (
    <button
      className={`btn rounded-full border-0 px-7 shadow-none ${colors} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
