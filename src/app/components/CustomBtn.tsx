"use client";

import ClipLoader from 'react-spinners/ClipLoader';

type AllowedButtonTypes = "submit" | "reset" | "button";
type ButtonProps = { 
    className:string,
    icon?: React.ReactNode,
    text: string,
    id?: string,
    type?: AllowedButtonTypes,
    disabled?: boolean,
    onClick?: ()=> void,
    loading?: boolean;
  };

export default function CustomBtn({ className, icon, text, id, type, disabled, onClick, loading }: ButtonProps) {
  return (
    <button
    className={className}
    id={id}
    type={type}
    disabled={disabled || loading}
    onClick={onClick}
    >
        {loading ? (
            <ClipLoader color="white" size={24} />
        ) : (
            <>
                {icon && <span className="mr-2">{icon}</span>}
                {text}
            </>
        )}
    </button>
  )
}