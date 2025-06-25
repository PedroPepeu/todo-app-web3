import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock ethers.js
vi.mock('ethers', () => ({
  Wallet: vi.fn().mockImplementation(() => ({
    address: '0x1234567890123456789012345678901234567890',
    privateKey: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    signTransaction: vi.fn(),
    signMessage: vi.fn(),
  })),
  Contract: vi.fn().mockImplementation(() => ({
    taskCount: vi.fn().mockResolvedValue(2),
    getTask: vi.fn().mockResolvedValue({
      id: 0,
      content: 'Test todo',
      completed: false
    }),
    addTask: vi.fn().mockResolvedValue({
      wait: vi.fn().mockResolvedValue({})
    }),
    updateTask: vi.fn().mockResolvedValue({
      wait: vi.fn().mockResolvedValue({})
    }),
    toggleComplete: vi.fn().mockResolvedValue({
      wait: vi.fn().mockResolvedValue({})
    }),
    deleteTask: vi.fn().mockResolvedValue({
      wait: vi.fn().mockResolvedValue({})
    }),
  })),
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock window.ethereum
Object.defineProperty(window, 'ethereum', {
  value: {
    request: vi.fn(),
    on: vi.fn(),
    removeListener: vi.fn(),
  },
  writable: true,
})

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
} 