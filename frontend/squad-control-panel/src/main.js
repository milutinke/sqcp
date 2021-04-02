import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueSweetalert2 from 'vue-sweetalert2';
import '@babel/polyfill';
import moment from 'moment';

// Styles
import 'sweetalert2/dist/sweetalert2.min.css';

// Config
Vue.config.productionTip = false;
Vue.config.baseURL = 'http://localhost/api/v1'; // Example: http://squad-control-panel.com/api/v1';

// Plugins
Vue.use(VueAxios, axios);
Vue.use(VueSweetalert2);
Vue.prototype.moment = moment;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
