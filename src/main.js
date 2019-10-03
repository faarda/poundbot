import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import './feather'

window.axios = require('axios');

Vue.config.productionTip = false

Vue.filter('capsfirst', function (value) {
  if (value !== null) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  } else {
    return "";
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
