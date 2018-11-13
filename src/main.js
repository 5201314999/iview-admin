import Vue from 'vue';
import App from './App';
import router from './router';
import iView from 'iview';
import config from './common/config';
import base from './common/base';
import api from './common/api';
import echarts from 'echarts';
import 'iview/dist/styles/iview.css';
import './styles/main.scss';

Vue.use(iView);
Vue.use(base);
Vue.prototype.G = config;
Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.prototype.$echarts = echarts;

const user = {};

const app = new Vue({
    router,
    el: '#tvflnet',
    render: h => h(App)
});

export {app, router, user};
