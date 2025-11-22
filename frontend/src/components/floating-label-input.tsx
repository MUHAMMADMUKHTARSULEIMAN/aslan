// src/components/FloatingLabelInput.tsx
'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { FormLabel } from '@/components/ui/form';

// Props inherited from InputProps, excluding the standard placeholder
interface FloatingLabelInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

// NOTE: We do not use this component directly in the form, 
// but pass props to it from the FormField component.
const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, className, ...props }, ref) => {

    const value = props.value || '';
    const [isFocused, setIsFocused] = React.useState(false);

    const hasValue = value.toString().length > 0;
    const isActive = isFocused || hasValue;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (props.onFocus) props.onFocus(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (props.onBlur) props.onBlur(e);
    };

    return (
      <div className="relative pt-4">
        <FormLabel
          className={`
            absolute left-3 top-1/2 cursor-text transition-all duration-200 
            ease-in-out transform -translate-y-1/2 text-muted-foreground pointer-events-none

            peer-focus:text-xs peer-focus:-translate-y-7 peer-focus:left-3 
            peer-focus:bg-background peer-focus:px-1 peer-focus:text-foreground

            ${
              isActive
                ? 'text-xs -translate-y-7 left-3 bg-background px-1 text-foreground'
                : ''
            }
          `}
        >
          {label}
        </FormLabel>
        <Input
          ref={ref} // Forward the ref to the native input element
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`peer h-12 ${className}`}
          placeholder="" // Important to set a placeholder/empty string to hide the default browser text
          {...props}
        />
      </div>
    );
  }
);

export default FloatingLabelInput;