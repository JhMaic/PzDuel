import {fileURLToPath, URL} from 'node:url'
import {defineConfig} from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
        }
    }
})
