/**
 * @project app
 * @author lirongtong <lirongtong@hotmail.com>
 * @github: https://github.com/wildidea
 * @date 2018-6-19 9:12
 */
import Vue from 'vue';
import App from './App';
import router from './router';
import iView from 'iview';
import base from './common/base';
import api from './common/api';
import _global from './config/global';
import 'iview/dist/styles/iview.css';
import './styles/main.scss';
import highlight from './plugins/highlight';

Vue.use(iView);
Vue.use(base);
Vue.use(highlight);
Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.prototype.G = _global;

let app, sid;
sid = Vue.prototype.getCookie('sid');
if(!sid){
    sid = Vue.prototype.getQueryString('sid');
}
const getBackUrl = function(){
    let url = 'authority-service.tvflnet.com',
        link = window.location.hostname, links;
    links = link.split('-');
    const env = Vue.prototype.trim(links[0]).toLowerCase();
    if(env === 'dev' || env === 'test'){
        url = env + '.' + url;
    }
    return 'https://' + url;
}, timeoutTip = function(){
    const id = 'timeout-modal',
        cls = 'timeout-hide',
        link = document.getElementById('timeout-modal-link'),
        elem = document.getElementById(id),
        width = document.body.offsetWidth,
        height = document.body.offsetHeight,
        left = (width - elem.offsetWidth) / 2,
        top = (height - elem.offsetHeight) / 2;
    elem.style.left = left + 'px';
    elem.style.top = top + 'px';
    Vue.prototype.removeClass(elem, cls);
    const url = getBackUrl();
    link.setAttribute('href', url);
};
if(sid != null && sid !== ''){
    api.get(Vue.prototype.parseUrl(_global.api.login, {sid: sid}), {}, function(res){
        if(res['ret']['retCode'].toString() === '0'){
            Vue.prototype.setCookie('sid', sid, 1);
            document.getElementById('timeout-modal').remove();
            app = new Vue({
                router,
                el: '#tvflnet',
                render: h => h(App)
            });
        }else{
            Vue.prototype.delCookie('sid');
            timeoutTip();
            window.onresize = function(){
                timeoutTip();
            };
        }
    }, function(){
        Vue.prototype.delCookie('sid');
        timeoutTip();
        window.onresize = function(){
            timeoutTip();
        };
    });
}else{
    timeoutTip();
    window.onresize = function(){
        timeoutTip();
    };
}
const user = {};
export {app, router, user};
