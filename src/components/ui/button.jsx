import React from "react";

const buttonVariants = {
  default: "bg-emerald-600 text-white shadow hover:bg-emerald-700",
  destructive: "bg-red-600 text-white shadow hover:bg-red-700",
  outline: "border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900",
  secondary: "bg-gray-200 text-gray-900 shadow hover:bg-gray-300",
  ghost: "hover:bg-gray-100 hover:text-gray-900",
  link: "text-emerald-600 underline-offset-4 hover:underline",
};

const buttonSizes = {
  default: "h-9 px-4 py-2",
  sm: "h-8 rounded-md px-3 text-xs",
  lg: "h-10 rounded-md px-8",
  icon: "h-9 w-9",
};

export function Button({ 
  children, 
  variant = "default", 
  size = "default", 
  className = "",
  disabled = false,
  type = "button",
  onClick,
  ...props 
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}