import { useForm } from 'react-hook-form';
import { FormInput } from '@/features/auth/components/FormInput';
import { PasswordInput } from '@/features/auth/components/PasswordInput';
import { type LoginFormValues, loginSchema } from '@/features/auth';
import { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
    onSubmit: (data: LoginFormValues) => Promise<void>
    isLoading: boolean
    serverError: string | null
};

export function LoginForm({ onSubmit, isLoading, serverError }: Props) {
    const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        shouldFocusError: true,
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!serverError) return

        if (
            serverError.toLowerCase().includes('wrong email or password') ||
            serverError.toLowerCase().includes('invalid credentials')
        ) {
            setError('email',    { type: 'server', message: '' }, { shouldFocus: false })
            setError('password', { type: 'server', message: serverError }, { shouldFocus: true })
        } else {
            setError('email', { type: 'server', message: serverError }, { shouldFocus: true })
        }
    }, [serverError, setError])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <h2>Log in</h2>

            <FormInput<LoginFormValues>
                register={register}
                name="email"
                type="email"
                placeholder="email"
                disabled={isLoading}
                error={errors.email}
                autoComplete="email"
            />

            <PasswordInput<LoginFormValues>
                register={register}
                name="password"
                placeholder="password"
                disabled={isLoading}
                showPassword={showPassword}
                onToggle={() => setShowPassword(v => !v)}
                error={errors.password}
            />

            <button className="bg-amber-400 rounded-xl h-10 w-80 p-5 flex items-center justify-center text-amber-50 font-bold cursor-pointer"
                    type="submit"
                    disabled={isLoading}
            >Log in</button>
        </form>
    );
}