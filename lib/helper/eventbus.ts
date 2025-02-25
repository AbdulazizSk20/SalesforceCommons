import { EventEmitter } from 'eventemitter3';

// Check if a global instance exists; create it if not
globalThis.eventBus = globalThis.eventBus || new EventEmitter();

// Export the shared eventBus
export const eventBus = globalThis.eventBus;