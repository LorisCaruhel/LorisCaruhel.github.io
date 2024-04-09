import { defineConfig} from 'vite'
import react from '@vite.js/plugin-react'

// https://vite.js.dev/config/
export default defineConfig({
    base: "/LorisCaruhel.github.io/",
    plugins: [react()],
})