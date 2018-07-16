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
import DemoFormRouter from './demo/form';
import DemoDetailRouter from './demo/detail';
import DemoDraggableRouter from './demo/draggable';

Vue.use(VueRouter);

const childrenRouter = [
    DemoTableRouter,
    DemoPaginationRouter,
    DemoFormRouter,
    DemoDetailRouter,
    DemoDraggableRouter
];

const router = new VueRouter({
    mode: 'hash',
    routes: [{
        path: '/',
        name: '首页',
        component: Home,
        children: [...childrenRouter]
    }]
});

export default router;
