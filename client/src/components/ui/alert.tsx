import React from "react";
import { cn } from "@/lib/utils";

interface AlertProps {
  className?: string;
  variant?: "default" | "destructive";
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  className,
  variant = "default",
  children,
}) => {
  const baseStyles = "relative w-full rounded-lg border p-4";
  const variantStyles = {
    default: "border-gray-200 bg-white text-gray-900",
    destructive: "border-red-200 bg-red-50 text-red-900",
  };

  return (
    <div className={cn(baseStyles, variantStyles[variant], className)}>
      {children}
    </div>
  );
};

interface AlertDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

export const AlertDescription: React.FC<AlertDescriptionProps> = ({
  className,
  children,
}) => {
  return (
    <div className={cn("text-sm", className)}>
      {children}
    </div>
  );
};