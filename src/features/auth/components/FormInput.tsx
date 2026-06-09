import type {FieldError, FieldValues, Path, UseFormRegister,} from 'react-hook-form';

type FormInputProps<T extends FieldValues> = {
    register: UseFormRegister<T>
    name: Path<T>
    type?: string
    placeholder: string
    disabled: boolean
    autoComplete?: string
    error?: FieldError
};

export function FormInput<T extends FieldValues>({ register, name, type = 'text', placeholder, disabled, error, autoComplete }: FormInputProps<T>) {
    return (
        <div className="flex flex-col gap-1">
            <input
                className={`border rounded-xl h-10 w-80 p-5 ${error ? 'border-red-400' : 'border-amber-400'}`}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete={autoComplete}
                {...register(name)}
            />
            {error?.message && (
                <span className="font-semibold text-red-400 text-sm">{error.message}</span>
            )}
        </div>

    );
}