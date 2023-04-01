import { createContext } from '$lib/trpc/context';
import { trpcMergedRouter } from '$lib/trpc/router';
import { createTRPCWebSocketServer } from 'trpc-sveltekit/websocket';
import { building } from '$app/environment';

if (!building) createTRPCWebSocketServer({ router: trpcMergedRouter, createContext });
