import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import '@testing-library/jest-dom/vitest';

// Global mocks setup
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

Object.defineProperty(window, 'confirm', {
  value: vi.fn(),
  writable: true,
});

global.fetch = vi.fn();

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
	cleanup();
});
