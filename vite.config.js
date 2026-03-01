import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: 8888, // Change port to avoid Service Worker conflicts on 5173
        strictPort: true,
    }
});
