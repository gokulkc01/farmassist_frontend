import React from "react";

export function Textarea({ 
  className = "",
  disabled = false,
  ...props 
}) {
  return (
    <textarea
      disabled={disabled}
      className={`flex min-h-[60px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}