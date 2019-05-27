import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home';
import LogRouter from '@/router/logs';
import Login from '@/views/login/Login.vue'

import DemoBasicRouter from '@/router/demo/basic';
import DemoExtendRouter from '@/router/demo/extend';

Vue.use(VueRouter);

const childrenRouter = [
    LogRouter,
    DemoBasicRouter,
    DemoExtendRouter
];

const router = new VueRouter({
    mode: 'hash',
    routes: [
        {
            path: '/main',
            name: '首页',
            component: Home,
            redirect: '/main/basic/form',
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
