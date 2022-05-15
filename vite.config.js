import reactRefresh from '@vitejs/plugin-react-refresh'
import 'dotenv/config'

/**
 * https://vitejs.dev/config/
 * @type { import('vite').UserConfig }
 */
export default {
  plugins: [reactRefresh()],
  server: {
    host: '0.0.0.0',
    hmr: {
      port: process.env.hmrPort,
    }
  }
}
