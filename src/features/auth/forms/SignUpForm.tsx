import { useForm } from 'react-hook-form';
import { FormInput } from '@/features/auth/components/FormInput';
import { PasswordInput } from '@/features/auth/components/PasswordInput';
import {type SignUpFormValues, signUpSchema} from '@/features/auth';
import {useEffect, useState} from 'react';
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
    onSubmit: (data: SignUpFormValues) => void
    isLoading: boolean
    serverError: string | null
};

export function SignUpForm({ onSubmit, isLoading,  serverError}: Props) {
    const { register, handleSubmit, setError, formState: { errors } } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        shouldFocusError: true,
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!serverError) return

        if (serverError.toLowerCase().includes('email already exists')) {
            setError('email', { type: 'server', message: serverError }, { shouldFocus: true })
        } else {
            setError('email', { type: 'server', message: serverError }, { shouldFocus: true })
        }
    }, [serverError, setError])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
            <h2>Create account</h2>

            <FormInput<SignUpFormValues>
                register={register}
                name="email"
                type="email"
                placeholder="email"
                disabled={isLoading}
                error={errors.email}
                autoComplete="new-email"
            />

            <PasswordInput<SignUpFormValues>
                register={register}
                name="password"
                placeholder="password"
                disabled={isLoading}
                showPassword={showPassword}
                onToggle={() => setShowPassword(v => !v)}
                error={errors.password}
            />

            <PasswordInput<SignUpFormValues>
                register={register}
                name="confirmPassword"
                placeholder="repeat password"
                disabled={isLoading}
                showPassword={showPassword}
                onToggle={() => setShowPassword(v => !v)}
                error={errors.confirmPassword}
            />

            <button className="bg-amber-400 rounded-xl h-10 w-80 p-5 flex items-center justify-center text-amber-50 font-bold cursor-pointer"
                    type="submit"
                    disabled={isLoading}
            >Sign up</button>
        </form>
    );
}