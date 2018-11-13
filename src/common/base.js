exports.install = (Vue) => {

    /**
     * get user information.
     * @returns {null}
     */
    Vue.prototype.getUser = function() {
        const vm = this,
            url = process.env.AUTH_SERVICES + vm.G.api.user;
        vm.$api.get(url, {
            method: 'getLoginUser',
            soaProId: vm.G.id.soa
        }, (res) => {
            if(res['ret']['retMsg'].toString() === '0'){
                vm.$set(vm.G, 'user', res.data);
                vm.$emit('get-user-success', res.data);
            }else{
                if(!vm.G.debug){
                    vm.$error('用户信息获取失败 ( ' + res['ret']['retMsg'] + ' )<br />即将跳转至登录页......');
                    setTimeout(() => {
                        window.location.href = process.env.AUTH_SERVICES;
                    }, 2000);
                }
            }
        }, () => {
            if(!vm.G.debug) window.location.href = process.env.AUTH_SERVICES;
        });
    };

    /**
     * logout
     * @returns {null}
     */
    Vue.prototype.logout = function() {
        const vm = this;
        vm.$api.get(process.env.AUTH_SERVICES + vm.G.api.logout, {
            method: 'logOutMsg'
        }, (res) => {
            if(res['ret']['retMsg'].toString() === '0'){
                window.location.href = process.env.AUTH_SERVICES;
            }else{
                vm.$error(res['ret']['retMsg']);
                return false;
            }
        }, (err) => {
            vm.$error(err);
            return false;
        });
    };

    /**
     * set document's title
     * @param title
     */
    Vue.prototype.setTitle = function(title) {
        const vm = this;
        document.title = (title ? title : vm.G.title) + ' - 后台管理';
    };

    /**
     * get url / query string.
     * @param name
     * @returns {*}
     */
    Vue.prototype.getUrl = function(name) {
        const vm = this;
        if(vm.trim(name) !== null){
            const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'),
                match = window.location.href.substr(1).match(reg);
            if(match !== null) return unescape(match[2]);
            return null;
        }else{
            return window.location.href;
        }
    };

    /**
     * parse url
     * @param url (format: {param})
     * @param params
     * @returns {*}
     */
    Vue.prototype.parseUrl = function(url, params) {
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
     * clear space (left and right or all).
     * @param string
     * @param all
     * @returns {*}
     */
    Vue.prototype.trim = function(string, all) {
        if(all) return string.replace(/\s+/g, '');
        else return string.replace(/^\s+|\s+$/g, '');
    };

    /**
     * in array
     * @param elem
     * @param array
     * @param i
     * @returns {number}
     */
    Vue.prototype.inArray = function(elem, array, i) {
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
     * has class.
     * @param obj
     * @param cls
     * @returns {boolean}
     */
    Vue.prototype.hasClass = function(obj, cls) {
        const names = obj.className,
            classes = names.split(/\s+/);
        for(let i in classes){
            if(classes.hasOwnProperty(i)){
                if(classes[i] === cls){
                    return true;
                }
            }
        }
        return false;
    };

    /**
     * remove class
     * @param obj
     * @param cls
     */
    Vue.prototype.removeClass = function(obj, cls) {
        let name = ' ' + obj.className + ' ';
        name.replace(/(\s+)/gi, ' ');
        let removed = name.replace(' ' + cls + ' ', ' ');
        removed = removed.replace(/(^\s+)|(\s+$)/g, '');
        obj.className = removed;
    };

    /**
     * add class.
     * @param obj
     * @param cls
     */
    Vue.prototype.addClass = function(obj, cls) {
        const name = obj.className,
            blank = name !== '' ? ' ' : '';
        obj.className = name + blank + cls;
    };

    /**
     * random.
     * @returns {string}
     */
    Vue.prototype.$random = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

    /**
     * generate unique key.
     * @returns {string}
     */
    Vue.prototype.$unique = function() {
        const vm = this;
        return (vm.$random() + vm.$random() + vm.$random() + vm.$random() + vm.$random() + vm.$random() + vm.$random() + vm.$random()).toLocaleUpperCase();
    };

    /**
     * receiving popup event.
     * @param event
     * @param unique
     * @see $success
     * @see $error
     * @see $warning
     */
    Vue.prototype.$onPopup = function(event, unique) {
        const vm = this,
            prefix = 'ivu-modal-',
            classes = {
                wrap: prefix + 'wrap',
                title: prefix + 'confirm-head-title',
                footer: prefix + 'confirm-footer',
                close: prefix + 'close'
            };
        vm.$on(event, (fn) => {
            const modals = document.getElementsByClassName(classes.wrap),
                length = modals.length;
            for(let i = 0; i < length; i++){
                const cur = modals[i],
                    title = cur.getElementsByClassName(classes.title)[0];
                if(title){
                    const parent = title.parentNode,
                        text = vm.trim(title.innerText);
                    if(text === vm.trim(unique)){
                        vm.addClass(cur, event);
                        parent.remove();
                        const footer = cur.getElementsByClassName(classes.footer),
                            close = cur.getElementsByClassName(classes.close);
                        if(footer) footer[0].remove();
                        if(close){
                            close[0].onclick = () => {
                                vm.$Modal.remove();
                            };
                        }
                        if((typeof fn).toUpperCase() === 'FUNCTION') fn.call(vm);
                        break;
                    }
                }
            }
        });
    };

    /**
     * emit event & close popup.
     * @param event
     * @param time
     */
    Vue.prototype.$emitPopup = function(event, time) {
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
    Vue.prototype.$success = function(content, width, time) {
        const vm = this, title = vm.$unique(),
            success = 'wi-modal-success';
        width = width ? width : 360;
        vm.$onPopup(success, title);
        vm.$Modal.success({
            content: `<div class="wi-modal-icon ${success}-icon"><i class="ivu-icon ivu-icon-ios-checkmark-circle"></i></div>` + content,
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
    Vue.prototype.$error = function(content, width, time) {
        const vm = this,
            title = vm.$unique(),
            error = 'wi-modal-error';
        width = width ? width : 360;
        vm.$onPopup(error, title);
        vm.$Modal.error({
            content: `<div class="wi-modal-icon ${error}-icon"><i class="ivu-icon ivu-icon-ios-close-circle"></i></div>` + content,
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
    Vue.prototype.$warning = function(content, width, time) {
        const vm = this, title = vm.$unique(),
            warning = 'wi-modal-warning';
        width = width ? width : 360;
        vm.$onPopup(warning, title);
        vm.$Modal.warning({
            content: `<div class="wi-modal-icon ${warning}-icon"><i class="ivu-icon ivu-icon-ios-alert"></i></div>` + content,
            width: width,
            title: title,
            closable: true
        });
        vm.$emitPopup(warning, time);
    };

    /**
     * confirm
     * @param content
     * @param ok
     * @param cancel
     * @param width
     * @param title
     */
    Vue.prototype.$confirm = function(content, ok, cancel, width, title) {
        title = title ? title : '温馨提示';
        width = width ? width : 360;
        const vm = this;
        vm.$Modal.confirm({
            title: title,
            content: `<div class="wi-modal-icon wi-modal-confirm-icon"><i class="ivu-icon ivu-icon-ios-help-circle"></i></div>` + content,
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
     * get cookie
     * @param cname
     * @returns {string}
     */
    Vue.prototype.getCookie = function(cname) {
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
     * set cookie
     * @param name
     * @param value
     * @param expire
     */
    Vue.prototype.setCookie = function(name, value, expire) {
        const d = new Date();
        d.setTime(d.getTime() + (expire * 24 * 60 * 60 * 1000));
        const expires = 'expires=' + d.toUTCString();
        document.cookie = name + '=' + value + ';' + expires;
    };

    /**
     * delete cookie
     * @param name
     */
    Vue.prototype.delCookie = function(name) {
        const d = new Date();
        d.setTime(d.getTime() - (24 * 60 * 60 * 1000));
        const expire = 'expires=' + d.toUTCString();
        document.cookie = name + '="";' + expire;
    };
};
