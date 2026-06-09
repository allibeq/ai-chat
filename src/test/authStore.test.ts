import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuthStore } from '../features/auth/stores/authStores'

vi.mock('../lib/pocketbase', () => ({
    default: {
        authStore: {
            clear: vi.fn(),
            save:  vi.fn(),
            model: null,
        },
        collection: vi.fn(() => ({
            authWithPassword: vi.fn(),
            authRefresh:      vi.fn(),
        })),
    },
}))

describe('authStore', () => {
    beforeEach(() => {
        useAuthStore.setState({ user: null, status: 'idle', error: null })
        vi.clearAllMocks()
    })

    it('logout clears the token and resets the state', async () => {
        useAuthStore.setState({ status: 'authenticated', user: { id: '123' } as any })

        await useAuthStore.getState().logout()

        const state = useAuthStore.getState()
        expect(state.status).toBe('unauthenticated')
        expect(state.user).toBeNull()
        expect(window.electron.clearToken).toHaveBeenCalledOnce()
    })

    it('restoreSession — no token - unauthenticated', async () => {
        vi.mocked(window.electron.loadToken).mockResolvedValue(null)

        await useAuthStore.getState().restoreSession()

        expect(useAuthStore.getState().status).toBe('unauthenticated')
    })

    it('restoreSession — network error - authenticated (the token is not deleted)', async () => {
        vi.mocked(window.electron.loadToken).mockResolvedValue('some-token')

        const pb = await import('../lib/pocketbase')
        vi.mocked(pb.default.collection).mockReturnValue({
            authRefresh: vi.fn().mockRejectedValue({ status: 0 }),
        } as any)

        await useAuthStore.getState().restoreSession()

        expect(useAuthStore.getState().status).toBe('authenticated')
        expect(window.electron.clearToken).not.toHaveBeenCalled()
    })
})