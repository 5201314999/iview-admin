/**
 * @project app
 * @author lirongtong <lirongtong@hotmail.com>
 * @github: https://github.com/wildidea
 * @date 2018-6-19 9:12
 */
import Vue from 'vue';
import App from './App';
import router from './router';
import iView from 'iview';
import base from './common/base';
import api from './common/api';
import _global from './config/global';
import 'iview/dist/styles/iview.css';
import './styles/main.scss';

Vue.use(iView);
Vue.use(base);
Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.prototype.G = _global;

const user = {};

const app = new Vue({
    router,
    el: '#tvflnet',
    render: h => h(App)
});

export {app, router, user};