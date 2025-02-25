import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/common.css'
// 引入顶部图标
import './assets/css/iconfont.css'

// 导入 Vant 组件
import { Swipe, SwipeItem, Checkbox, Stepper, Radio, RadioGroup } from 'vant' // 添加 Radio 和 RadioGroup
// 导入 Vant 的样式文件
import 'vant/lib/index.css'
// 引入 Pinia
import { createPinia } from 'pinia'
//Tailwind
import '/src/assets/main.css'

const app = createApp(App)

// 注册 Vant 组件
app.use(Checkbox)
app.use(Stepper)
app.use(Swipe)
app.use(SwipeItem)
app.use(Radio) // 注册 Radio 组件
app.use(RadioGroup) // 注册 RadioGroup 组件
app.use(router)
app.use(createPinia())
app.mount('#app')