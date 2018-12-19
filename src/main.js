import Vue from 'vue';
import App from './App';
import router from './router';
import iView from 'iview';
import 'viewerjs/dist/viewer.min';
import iViewer from 'v-viewer'
import config from './common/config';
import tools from './common/tools';
import api from './common/api';
import echarts from 'echarts';
import 'iview/dist/styles/iview.css';
import 'viewerjs/dist/viewer.min.css'
import './styles/main.scss';
import highlight from './directives/highlight';
import LazyLoad from 'vue-lazyload';
import * as filters from './common/filters';

Vue.use(iView);
Vue.use(iViewer, {
    defaultOptions: {
        zIndex: 20181120,
        title: false
    }
});
Vue.use(LazyLoad, {
    error: '../static/images/error.png',
    loading: '../static/images/default.png',
    attempt: 1
});
Vue.use(tools);
Vue.use(highlight);
Vue.prototype.G = config;
Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.prototype.$echarts = echarts;

Object.keys(filters).forEach((key) => {
    Vue.filter(key, filters[key]);
});

const user = {};

const app = new Vue({
    router,
    el: '#wi',
    render: h => h(App)
});

export {app, router, user};
