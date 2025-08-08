import { setupServer } from 'msw/node';
import handlers from './handlers';

/**
 * Mock Service Worker server instance for tests
 * 
 * This server can be imported directly in tests to override handlers
 * or check request history without importing from setupTests
 */
export const server = setupServer(...handlers);

export default server;
