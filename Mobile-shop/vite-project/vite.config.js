import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
		// 设置代理
		proxy: {
			'/api': {
				target: 'http://localhost:3000', // 目标服务器地址
				changeOrigin: true, // 是否改变请求头中的 Origin，默认为 false
				rewrite: (path) => path.replace(/^\/api/, '/api'), // 重写路径
			},
		},
	}
})
