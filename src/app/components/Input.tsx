import { usePassword } from "@/app/hooks/usePassword";
import { Eye, EyeOff } from "lucide-react";
import { InputHTMLAttributes, forwardRef } from "react";

type AllowedInputTypes = "search" | "text" | "email" | "tel" | "url" | "none" | "numeric" | "decimal";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  labelText?: string;
  htmlType?: string;
  button?: boolean;
  error?: string;
  inputMode?: AllowedInputTypes;
};

const Input = forwardRef<HTMLInputElement, InputProps>(({
  labelText,
  name,
  id,
  htmlType = 'text',
  required,
  value,
  onChange,
  button = false,
  inputMode,
  placeholder,
  error,
  className = '',
  ...props
}, ref) => {
  const { showPassword, togglePasswordVisibility } = usePassword();
  const type = button ? (showPassword ? 'text' : 'password') : htmlType;

  return (
    <div className="mb-4">
      {labelText && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {labelText}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          {...props}
          ref={ref}
          type={type}
          inputMode={inputMode}
          name={name}
          id={id}
          className={`block w-full p-2 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none ${
            button ? 'pr-10' : ''
          } ${className}`}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
        />
        {button && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? (
              <Eye className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeOff className="h-5 w-5 text-gray-400" />
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;