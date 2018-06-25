/**
 * @project app
 * @author lirongtong <lirongtong@hotmail.com>
 * @github: https://github.com/wildidea
 * @date 2018-6-19 9:12
 */
import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../views/Home'

import previewRouter from './control/preview';
import LogRouter from './control/log';

Vue.use(VueRouter);

const childrenRouter = [
    previewRouter,
    LogRouter
];

const router = new VueRouter({
    mode: 'hash',
    routes: [{
        path: '/',
        component: Home,
        children: [...childrenRouter]
    }]
});

export default router;