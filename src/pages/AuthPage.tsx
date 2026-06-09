import { useState } from 'react';
import { LoginForm, SignUpForm, useAuthStore } from '@/features/auth';

type Mode = 'login' | 'signup';

export default function AuthPage() {
    const [mode, setMode] = useState<Mode>('login');
    const { login, signUp, status, error: serverError, clearError } = useAuthStore();
    const isLoading = status === 'loading';

    const switchMode = () => {
        clearError();
        setMode(m => m === 'login' ? 'signup' : 'login');
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-5">
            {mode === 'login' ? (
                <LoginForm
                    isLoading={isLoading}
                    onSubmit={login}
                    serverError={serverError}
                />
            ) : (
                <SignUpForm
                    isLoading={isLoading}
                    onSubmit={signUp}
                    serverError={serverError}
                />
            )}

            <span>
                {mode === 'login' ? "don't have an account?" : 'have an account?'}
                <button
                    type="button"
                    onClick={switchMode}
                    className="underline cursor-pointer"
                >
                    {mode === 'login' ? 'create account' : 'log in'}
                </button>
            </span>
        </div>
    );
}