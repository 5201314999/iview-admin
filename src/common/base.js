/**
 * @project app
 * @author lirongtong <lirongtong@hotmail.com>
 * @github: https://github.com/wildidea
 * @date 2018-6-19 8:37
 */
exports.install = function(Vue){

    /**
     * get user info
     * @returns {null}
     */
    Vue.prototype.getUserInfo = function(){
        const vm = this;
        vm.$api.get(vm.G.api.user, {}, function(res){
            if(res['ret']['retCode'].toString() === '0'){
                vm.$set(vm.G, 'user', res.data);
                vm.$emit('get-user-success', res.data);
            }else{
                vm.$error(res['ret']['retMsg']);
                return false;
            }
        }, function(err){
            vm.$error(err);
            return false;
        });
    };

    /**
     * logout
     * @returns {null}
     */
    Vue.prototype.logout = function(){
        const vm = this;
        vm.$api.get(vm.G.api.logout, {}, function(res){
            if(res['ret']['retCode'].toString() === '0'){
                window.location.href = process.env.AUTH_SERVICES;
            }else{
                vm.$error(res['ret']['retMsg']);
                return false;
            }
        }, function(err){
            vm.$error(err);
            return false;
        });
    };

    /**
     * set document's title
     * @param title
     */
    Vue.prototype.setTitle = function(title){
        document.title = (title ? title : this.G.title) + ' - 后台管理';
    };

    /**
     * in array
     * @param elem
     * @param array
     * @param i
     * @returns {*}
     */
    Vue.prototype.inArray = function(elem, array, i){
        let len;
        if(array){
            len = array.length;
            i = i ? i < 0 ? Math.max(0, len + i) : i : 0;
            for(; i < len; i++){
                if(i in array && array[i] ===  elem){
                    return i;
                }
            }
        }
        return -1;
    };

    /**
     * parse url
     * @param url (format: {param})
     * @param params
     * @returns {*}
     */
    Vue.prototype.parseUrl = function(url, params){
        params = params ? params : {};
        if(Object.keys(params).length > 0){
            for(const i in params){
                if(params.hasOwnProperty(i)){
                    const reg = new RegExp('\{' + i + '\}', 'gi');
                    url = url.replace(reg, params[i]);
                }
            }
        }
        return url;
    };

    /**
     * has class
     * @param obj
     * @param cls
     * @returns {*}
     */
    Vue.prototype.hasClass = function(obj, cls){
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    };

    /**
     * add class
     * @param obj
     * @param cls
     */
    Vue.prototype.addClass = function(obj, cls){
        const vm = this;
        if(!vm.hasClass(obj, cls)){
            obj.className += ' ' + cls;
        }
    };

    /**
     * remove class
     * @param obj
     * @param cls
     */
    Vue.prototype.removeClass = function(obj, cls){
        const vm = this,
            reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        if(obj.length && obj.length > 0){
            const len = obj.length;
            for(let i = 0; i < len; i++){
                if(vm.hasClass(obj[i], cls)){
                    obj[i].className = obj[i].className.replace(reg, '');
                }
            }
        }else{
            if(vm.hasClass(obj, cls)){
                obj.className = obj.className.replace(reg, '');
            }
        }
    };

    /**
     * random.
     * @returns {string}
     */
    Vue.prototype.$random = function(){
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

    /**
     * generate unique key.
     * @returns {string}
     */
    Vue.prototype.$unique = function(){
        const vm = this;
        return (vm.$random() + vm.$random() + vm.$random() + vm.$random() + vm.$random() + vm.$random() + vm.$random() + vm.$random()).toLocaleUpperCase();
    };

    /**
     * clear space (left and right or all).
     * @param string
     * @param all
     * @returns {*}
     */
    Vue.prototype.trim = function(string, all){
        if(all) return string.replace(/\s+/g, '');
        else return string.replace(/^\s+|\s+$/g, '');
    };

    /**
     * confirm
     * @param content
     * @param ok
     * @param cancel
     * @param width
     * @param title
     */
    Vue.prototype.$confirm = function(content, ok, cancel, width, title){
        title = title ? title : '温馨提示';
        width = width ? width : 360;
        const vm = this;
        vm.$Modal.confirm({
            title: title,
            content: content,
            width: width,
            closable: true,
            loading: true,
            onOk: function(){
                vm.$Modal.remove();
                if((typeof ok).toLowerCase() === 'function'){
                    ok.call();
                }
            },
            onCancel: function(){
                if((typeof cancel).toLowerCase() === 'function'){
                    cancel.call();
                }
            }
        });
    };

    /**
     * receiving event.
     * @param event
     * @param unique
     */
    Vue.prototype.$onPopup = function(event, unique){
        const vm = this,
            classes = {
                wrap: 'ivu-modal-wrap',
                title: 'ivu-modal-confirm-head-title',
                footer: 'ivu-modal-confirm-footer',
                close: 'ivu-modal-close'
            };
        vm.$on(event, function(fn){
            const modals = document.getElementsByClassName(classes.wrap),
                length = modals.length;
            let i = 0;
            if(length > 0){
                for(; i < length; i++){
                    let cur = modals[i],
                        title = cur.getElementsByClassName(classes.title)[0];
                    if(title){
                        let parent = title.parentNode,
                            text = vm.trim(title.innerText);
                        if(text === vm.trim(unique)){
                            vm.addClass(cur, event);
                            parent.remove();
                            cur.getElementsByClassName(classes.footer)[0].remove();
                            let close = cur.getElementsByClassName(classes.close)[0];
                            close.onclick = function(){
                                vm.$Modal.remove();
                            };
                            if(typeof fn === 'function') fn.call(vm);
                            break;
                        }
                    }
                }
            }
        });
    };

    /**
     * emit event & close popup.
     * @param event {*}
     * @param time
     */
    Vue.prototype.$emitPopup = function(event, time){
        const vm = this;
        time = typeof time !== 'undefined' ? time : 0;
        vm.$nextTick(() => {
            vm.$emit(event, function(){
                if(time && time > 0){
                    setTimeout(() => {
                        vm.$Modal.remove();
                    }, time * 1000);
                }
            });
        });
    };

    /**
     * success
     * @param content
     * @param width
     * @param time
     */
    Vue.prototype.$success = function(content, width, time){
        const vm = this, title = vm.$unique(),
            success = 'fl-modal-success';
        width = width ? width : 300;
        vm.$onPopup(success, title);
        vm.$Modal.success({
            content: content,
            width: width,
            title: title,
            closable: true
        });
        vm.$emitPopup(success, time);
    };

    /**
     * error
     * @param content
     * @param width
     * @param time
     */
    Vue.prototype.$error = function(content, width, time){
        const vm = this, title = vm.$unique(),
            error = 'fl-modal-error';
        width = width ? width : 300;
        vm.$onPopup(error, title);
        vm.$Modal.error({
            content: content,
            width: width,
            title: title,
            closable: true
        });
        vm.$emitPopup(error, time);
    };

    /**
     * warning
     * @param content
     * @param width
     * @param time
     */
    Vue.prototype.$warning = function(content, width, time){
        const vm = this, title = vm.$unique(),
            warning = 'fl-modal-warning';
        width = width ? width : 300;
        vm.$onPopup(warning, title);
        vm.$Modal.warning({
            content: content,
            width: width,
            title: title,
            closable: true
        });
        vm.$emitPopup(warning, time);
    };

    /**
     * get cookie.
     * @param cname
     * @returns {string}
     */
    Vue.prototype.getCookie = function(cname){
        const name = cname + '=',
            ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while(c.charAt(0) === ' ') c = c.substring(1);
            if(c.indexOf(name) !== -1){
                return c.substring(name.length, c.length);
            }
        }
        return '';
    };

    /**
     * set cookie.
     * @param name
     * @param value
     * @param expire
     */
    Vue.prototype.setCookie = function(name, value, expire){
        const d = new Date();
        d.setTime(d.getTime() + (expire * 24 * 60 * 60 * 1000));
        const expires = 'expires=' + d.toUTCString();
        document.cookie = name + '=' + value + ';' + expires;
    };

    /**
     * del cookie.
     * @param name
     */
    Vue.prototype.delCookie = function(name){
        const d = new Date();
        d.setTime(d.getTime() - (24 * 60 * 60 * 1000));
        const expire = 'expires=' + d.toUTCString();
        document.cookie = name + '="";' + expire;
    };
};
