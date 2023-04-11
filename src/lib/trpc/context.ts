import type { inferAsyncReturnType } from '@trpc/server';
import type { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';
import { EventEmitter } from 'events';
import * as Actions from './socketActions';

const ee = new EventEmitter();

export async function createContext(opts: CreateHTTPContextOptions | CreateWSSContextFnOptions) {
	return {
		...opts,
		// context information
		emitter: ee,
		...Actions
	};
}

export type Context = inferAsyncReturnType<typeof createContext>;
