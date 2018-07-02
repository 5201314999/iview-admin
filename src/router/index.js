/**
 * @project app
 * @author lirongtong <lirongtong@hotmail.com>
 * @github: https://github.com/wildidea
 * @date 2018-6-19 9:12
 */
import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../views/Home'

import DemoTableRouter from './demo/table';
import DemoPaginationRouter from './demo/pagination';

Vue.use(VueRouter);

const childrenRouter = [
    DemoTableRouter,
    DemoPaginationRouter
];

const router = new VueRouter({
    mode: 'hash',
    routes: [{
        path: '/',
        name: 'Home',
        component: Home,
        children: [...childrenRouter]
    }]
});

export default router;