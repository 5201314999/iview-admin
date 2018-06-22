/**
 * @project app
 * @author lirongtong <lirongtong@hotmail.com>
 * @github: https://github.com/wildidea
 * @date 2018-6-21 11:03
 */
import Vue from 'vue';
import VueX from 'vuex';

Vue.use(VueX);

const modules = {};

const store = new VueX.Store({
    modules
});

export default store;