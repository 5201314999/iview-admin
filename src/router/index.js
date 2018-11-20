import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home';
import LogRouter from '@/router/logs';

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
    routes: [{
        path: '/',
        name: '首页',
        component: Home,
        redirect: '/basic/input',
        children: [...childrenRouter]
    }]
});

export default router;
