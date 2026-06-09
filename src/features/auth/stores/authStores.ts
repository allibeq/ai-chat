import { create } from 'zustand'
import pb from '../../../lib/pocketbase'
import type { RecordModel } from 'pocketbase'

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'

type AuthPayload = {
    email: string;
    password: string;
}

interface AuthState {
    user:   RecordModel | null
    status: AuthStatus
    error:  string | null

    login:          (data: AuthPayload) => Promise<void>
    signUp:         (data: AuthPayload) => Promise<void>
    logout:         () => Promise<void>
    restoreSession: () => Promise<void>
    clearError:     () => void
}

function formatError(err: unknown, context: 'login' | 'signup'): string {
    if (!(err instanceof Error)) return 'Something went wrong. Please try again.'

    const pbErr = err as Error & {
        status?: number
        response?: { message?: string; data?: Record<string, { message?: string }> }
    }

    const status  = pbErr.status
    const message = pbErr.response?.message?.toLowerCase() ?? err.message.toLowerCase()
    const data    = pbErr.response?.data ?? {}

    if (
        message.includes('failed to fetch') ||
        message.includes('networkerror') ||
        message.includes('network error') ||
        status === 0
    ) {
        return 'Problem reaching the server'
    }

    if (data.email) {
        const emailMsg = data.email.message?.toLowerCase() ?? ''

        if (emailMsg.includes('unique') || emailMsg.includes('already exists')) {
            return 'An account with this email already exists.'
        }
    }

    if (context === 'signup') {
        if (
            status === 400 &&
            (message.includes('unique') || message.includes('already exists'))
        ) {
            return 'An account with this email already exists.'
        }
        if (status === 400) {
            return 'An account with this email already exists.'
        }
    }

    if (context === 'login') {
        if (
            status === 400 ||
            message.includes('invalid credentials') ||
            message.includes('failed to authenticate')
        ) {
            return 'Wrong email or password.'
        }
        if (status === 404 || message.includes('not found')) {
            return 'Wrong email or password.'
        }
    }

    return err.message || 'Something went wrong. Please try again.'
}

export const useAuthStore = create<AuthState>((set) => ({
    user:   null,
    status: 'idle',
    error:  null,

    login: async ({ email, password}) => {
        set({ status: 'loading', error: null })
        try {
            const { record, token } = await pb
                .collection('users')
                .authWithPassword(email, password)
            await window.electron.saveToken(token)

            set({ user: record, status: 'authenticated', error: null })
        } catch (err) {
            set({ status: 'unauthenticated', error: formatError(err, 'login') })
        }
    },

    signUp: async ({email, password}) => {
        set({ status: 'loading', error: null })
        try {
             await pb.collection('users').create({
                email,
                password,
                passwordConfirm: password,
            });

            const { record, token } = await pb
                .collection('users')
                .authWithPassword(email, password)
            await window.electron.saveToken(token)
            set({ user: record, status: 'authenticated', error: null })
        } catch (err) {
            set({ status: 'unauthenticated', error: formatError(err, 'signup') })
        }
    },

    logout: async () => {
        pb.authStore.clear()
        await window.electron.clearToken()
        set({ user: null, status: 'unauthenticated', error: null })
    },

    restoreSession: async () => {
        const current = useAuthStore.getState().status
        if (current === 'loading' || current === 'authenticated') return
        set({ status: 'loading' })
        try {
            const token = await window.electron.loadToken()
            if (!token) {
                set({ status: 'unauthenticated' })
                return
            }

            pb.authStore.save(token, null)

            const { record, token: freshToken } = await pb
                .collection('users')
                .authRefresh()

            if (freshToken !== token) {
                await window.electron.saveToken(freshToken)
            }

            set({ user: record, status: 'authenticated', error: null })
        } catch (err) {
            const pbErr = err as { status?: number }
            if (pbErr.status === 401) {
                pb.authStore.clear()
                await window.electron.clearToken()
                set({ user: null, status: 'unauthenticated' })
            } else {
                set({ status: 'authenticated', error: null })
            }
        }
    },

    clearError: () => set({ error: null })
}))