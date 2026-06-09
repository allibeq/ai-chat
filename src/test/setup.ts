import '@testing-library/jest-dom'
import { vi } from 'vitest'

Object.defineProperty(window, 'electron', {
    value: {
        saveToken:  vi.fn().mockResolvedValue(undefined),
        loadToken:  vi.fn().mockResolvedValue(null),
        clearToken: vi.fn().mockResolvedValue(undefined),
        callAI:     vi.fn().mockResolvedValue('Mock AI reply'),
    },
    writable: true,
})