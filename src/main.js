import Vue from 'vue'
import App from './App.vue'
import '@/assets/main.scss'

Vue.config.productionTip = false

import VueExcelTable from '@/components/VueExcelTable'

export default VueExcelTable

new Vue({
  render: h => h(App)
}).$mount('#app')
