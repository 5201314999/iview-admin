/**
 * @project app
 * @author lirongtong <lirongtong@hotmail.com>
 * @github: https://github.com/wildidea
 * @date 2018-6-19 9:12
 */
import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../views/Home'
import Login from '../views/Login';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'hash',
    routes: [{
        path: '/',
        component: Home,
        children: []
    }, {path: '/login', component: Login}]
});

export default router;