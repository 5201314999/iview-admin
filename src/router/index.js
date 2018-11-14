import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home';
import LogRouter from '@/router/logs';

import DemoFormRouter from '@/router/demo/form';

Vue.use(VueRouter);

const childrenRouter = [
    LogRouter,

    DemoFormRouter
];

const router = new VueRouter({
    mode: 'hash',
    routes: [{
        path: '/',
        name: '首页',
        component: Home,
        redirect: '/form/input',
        children: [...childrenRouter]
    }]
});

export default router;
