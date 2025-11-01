import React from "react";

const alertVariants = {
  default: "bg-white border-gray-200 text-gray-900",
  destructive: "bg-red-50 border-red-200 text-red-900 dark:border-red-900 dark:text-red-500",
};

export function Alert({ children, variant = "default", className = "" }) {
  return (
    <div
      role="alert"
      className={`relative w-full rounded-lg border px-4 py-3 text-sm ${alertVariants[variant]} ${className}`}
    >
      {children}
    </div>
  );
}

export function AlertTitle({ children, className = "" }) {
  return (
    <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`}>
      {children}
    </h5>
  );
}

export function AlertDescription({ children, className = "" }) {
  return (
    <div className={`text-sm [&_p]:leading-relaxed ${className}`}>
      {children}
    </div>
  );
}