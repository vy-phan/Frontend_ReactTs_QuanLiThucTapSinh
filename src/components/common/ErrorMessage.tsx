import { ErrorMessageProps } from "@/@type/type";
import { cn } from "@/lib/utils";

export const ErrorMessage = ({ message, className }: ErrorMessageProps) => {
  return (
    <div className={cn(
      "text-sm font-medium text-red-600 dark:text-red-400",
      "bg-red-50/80 dark:bg-red-900/20",
      "px-3 py-2 rounded-lg mt-1 flex items-start gap-2",
      "border border-red-200 dark:border-red-800/50",
      "animate-in fade-in-50 slide-in-from-top-1",
      className
    )}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-4 w-4 mt-0.5 flex-shrink-0" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      <span>{message}</span>
    </div>
  );
};