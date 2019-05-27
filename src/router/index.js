import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home';
import Login from '@/views/login/Login.vue';

import strategySquare from './strategySquare.js';
import strategyResearch from './strategyResearch.js';
import factorLibrary from './factorLibrary.js';
import paperTrading from './paperTrading.js';
import multidimensionalData from './multidimensionalData.js';
import docs from './docs.js';
import setting from './setting.js';


Vue.use(VueRouter);

const childrenRouter = [
    strategySquare,
    strategyResearch,
    factorLibrary,
    paperTrading,
    multidimensionalData,
    docs,
    setting
];

const router = new VueRouter({
    mode: 'hash',
    routes: [
        {
            path: '/main',
            name: '首页',
            component: Home,
            redirect: '/strategySquare',
            children: [...childrenRouter]
        },
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name:'登录',
            component: Login
        }
    ]
});

export default router;
