import { sveltekit } from '@sveltejs/kit/vite';
import { vitePluginTrpcWebSocket } from 'trpc-sveltekit/websocket';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit(), vitePluginTrpcWebSocket]
};

export default config;
