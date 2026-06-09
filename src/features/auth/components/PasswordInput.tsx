import type { FieldError, FieldValues, Path, UseFormRegister } from 'react-hook-form';

import OpenEye from '@/assets/open-eye.svg?react';
import ClosedEye from '@/assets/closed-eye.svg?react';

type PasswordInputProps<T extends FieldValues> = {
    register: UseFormRegister<T>
    name: Path<T>
    placeholder: string
    disabled: boolean
    showPassword: boolean
    onToggle: () => void
    error?: FieldError
};

export function PasswordInput<T extends FieldValues>({ register, name, placeholder, disabled, showPassword, onToggle, error }: PasswordInputProps<T>) {
    const EyeIcon = showPassword ? OpenEye : ClosedEye;

    return (
        <div className="flex flex-col gap-1">
            <div className="relative">
                <input
                    className={`border rounded-xl h-10 w-80 p-5 pr-12 ${error ? 'border-red-400' : 'border-amber-400'}`}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete="off"
                    {...register(name)}
                />

                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                    <EyeIcon className="size-5 fill-amber-400" />
                </button>
            </div>
            {error?.message && (
                <span className="font-semibold text-red-400 text-sm">{error.message}</span>
            )}
        </div>

    );
}