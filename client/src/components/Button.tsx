import { forwardRef, type ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--copper)] text-[var(--paper)] hover:bg-[#a05626] hover:shadow-lg hover:shadow-[var(--copper)]/30 hover:scale-[1.02] active:scale-[0.98]',
  secondary:
    'bg-[var(--moss)] text-[var(--paper)] hover:bg-[#253e2e] hover:shadow-lg hover:shadow-[var(--moss)]/30 hover:scale-[1.02] active:scale-[0.98]',
  ghost:
    'bg-transparent text-[var(--ink)] border border-[var(--sand)] hover:bg-[var(--sand)] hover:scale-[1.01] active:scale-[0.99]',
  danger:
    'bg-[var(--rust)] text-[var(--paper)] hover:bg-[#7a3930] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, className = '', children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Processing...
        </>
      ) : children}
    </button>
  )
);
Button.displayName = 'Button';
