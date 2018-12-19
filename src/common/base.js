exports.install = (Vue) => {

    /**
     * get user information.
     * @returns {null}
     */
    Vue.prototype.getUser = function () {
        const vm = this,
            url = process.env.AUTH_SERVICES + vm.G.api.user;
        vm.$api.get(url, {
            method: 'getLoginUser',
            soaProId: vm.G.id.soa
        }, (res) => {
            if (res['ret']['retCode'].toString() === '0') {
                vm.$set(vm.G, 'user', res.data);
                vm.$emit('get-user-success', res.data);
            } else {
                if (!vm.G.debug) {
                    vm.$error('用户信息获取失败 ( ' + res['ret']['retMsg'] + ' )<br />即将跳转至登录页......');
                    setTimeout(() => {
                        window.location.href = process.env.AUTH_SERVICES;
                    }, 2000);
                }
            }
        }, () => {
            if (!vm.G.debug) window.location.href = process.env.AUTH_SERVICES;
        });
    };

    /**
     * logout
     * @returns {null}
     */
    Vue.prototype.logout = function () {
        const vm = this;
        vm.$api.get(process.env.AUTH_SERVICES + vm.G.api.logout, {
            method: 'logOutMsg',
            proId: vm.G.id.pro
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
    Vue.prototype.setTitle = function (title) {
        const vm = this;
        document.title = (title ? title : vm.G.title) + ' - 后台管理';
    };

    /**
     * get url / query string.
     * @param name
     * @returns {*}
     */
    Vue.prototype.getUrlOrParam = function (name) {
        const vm = this;
        let parameters = {};
        if(vm.trim(name) !== null){
            const vm = this,
                path = vm.$route.path,
                location = window.location,
                search = location.search,
                searches = search ? search.replace('?', '').split('&') : [],
                hash = location.hash,
                hashes = hash
                    ? hash.replace(path, '')
                        .replace('?', '')
                        .replace('#', '')
                        .split('&')
                    : [];
            if(searches){
                searches.map((item) => {
                    const param = item.split('=');
                    if(param && param.length > 1){
                        parameters[vm.trim(param[0])] = vm.trim(param[1]);
                    }
                });
            }
            if(hashes){
                hashes.map((item) => {
                    const param = item.split('=');
                    if(param && param.length > 1){
                        const key = vm.trim(param[0]),
                            value = vm.trim(param[1]);
                        if(!parameters[key]) parameters[key] = value;
                    }
                });
            }
            if(parameters[name]) return parameters[name];
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
    Vue.prototype.parseUrl = function (url, params) {
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
     * set parent's iframe height
     * if `G.embed` is trued.
     * @returns {null}
     * @see parseIframeUrlParams
     */
    Vue.prototype.setIframeHeight = function() {
        try{
            const vm = this,
                id = vm.getUrlOrParam('element'),
                iframe = parent.document.getElementById(id);
            document.body.style.overflow = 'hidden';
            iframe.style.height = document.body.scrollHeight + 'px';
            return null;
        }catch(e){
            throw new Error('set parent iframe height error.');
        }
    };
    
    /**
     * reset iframe height.
     * set `0` before route changed.
     */
    Vue.prototype.resetIframeHeight = function() {
        const vm = this,
            id = vm.getUrlOrParam('element'),
            iframe = parent.document.getElementById(id);
        iframe.style.height = '0';
    };
    
    /**
     * monitor iframe's height.
     * if change, setInterval & clearInterval.
     */
    Vue.prototype.monitorIframeHeight = function() {
        const vm = this,
            handler = setInterval(() => {
                vm.setIframeHeight();
            }, 1);
        setTimeout(() => {
            clearInterval(handler);
        }, 1000);
    };
    
    /**
     * parse url params (iframe).
     * @param id
     * @param domain
     * @returns {string}
     */
    Vue.prototype.parseIframeUrlParams = function(id, domain) {
        const vm = this,
            location = window.location,
            hash = location.hash,
            hashes = hash.split('?');
        let page = null, url = location.href;
        hashes.shift();
        if(hashes.length > 0){
            const parameters = hashes[0].split('&');
            let params = {};
            for(let i = 0; i < parameters.length; i++){
                const item = parameters[i],
                    items = item.split('=');
                params[items[0]] = decodeURIComponent(items[1])
                    .toString()
                    .replace(/^\{/gi, '')
                    .replace(/\}$/gi, '');
            }
            const mapping = vm.G.id.mapping;
            for(let k in mapping){
                if(mapping.hasOwnProperty(k)){
                    if(params.hasOwnProperty(mapping[k])){
                        params[mapping[k]] = vm.G.id[k];
                    }
                }
            }
            let parameter = ['element=' + id, 'embed=true'];
            for(let n in params){
                if(params.hasOwnProperty(n)){
                    if(params[n].toString().indexOf('.htm') !== -1){
                        page = params[n];
                        delete params[n];
                    }else parameter.push(n.toString() + '=' + params[n]);
                }
            }
            url = (domain ? domain : vm.G.domains.webservices) + '/' + (page ? page : 'index.html') + '?' + parameter.join('&');
        }
        return url;
    };

    /**
     * clear space (left and right or all).
     * @param string
     * @param all
     * @returns {*}
     */
    Vue.prototype.trim = function (string, all) {
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
    Vue.prototype.inArray = function (elem, array, i) {
        let len;
        if(array){
            len = array.length;
            i = i ? i < 0 ? Math.max(0, len + i) : i : 0;
            for(; i < len; i++){
                if(i in array && array[i] === elem){
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
    Vue.prototype.hasClass = function (obj, cls) {
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
    Vue.prototype.removeClass = function (obj, cls) {
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
    Vue.prototype.addClass = function (obj, cls) {
        const name = obj.className,
            blank = name !== '' ? ' ' : '';
        obj.className = name + blank + cls;
    };

    /**
     * format
     * @param date
     * @param type
     * @returns {string}
     */
    Vue.prototype.formatDate = function (date, type) {
        const y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours(),
            min = date.getMinutes(),
            seconds = date.getSeconds(),
            format = null;
        h = h < 10 ? '0' + h : h;
        min = min < 10 ? '0' + min : min;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        switch(type){
            case 1:
                format = y + '-' + m + '-' + d;
                break;
            case 2:
                format = h + ':' + min + ':' + seconds;
                break;
            case 3:
                format = y + '-' + m + '-' + d + ' ' + h + ':' + min;
                break;
            default:
                format = y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + seconds;
                break;
        }
        return format;
    };

    /**
     * random.
     * @returns {string}
     */
    Vue.prototype.$random = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

    /**
     * generate unique key.
     * @returns {string}
     */
    Vue.prototype.$unique = function () {
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
     * @see $confirm
     */
    Vue.prototype.$onPopup = function (event, unique) {
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
    Vue.prototype.$emitPopup = function (event, time) {
        const vm = this;
        time = typeof time !== 'undefined' ? time : 0;
        vm.$nextTick(() => {
            vm.$emit(event, function() {
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
    Vue.prototype.$success = function (content, width, time) {
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
    Vue.prototype.$error = function (content, width, time) {
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
    Vue.prototype.$warning = function (content, width, time) {
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
    Vue.prototype.$confirm = function (content, ok, cancel, width, title) {
        title = title ? title : '温馨提示';
        width = width ? width : 360;
        const vm = this;
        vm.$Modal.confirm({
            title: title,
            content: `<div class="wi-modal-icon wi-modal-confirm-icon"><i class="ivu-icon ivu-icon-ios-help-circle"></i></div>` + content,
            width: width,
            closable: true,
            loading: true,
            onOk: function () {
                vm.$Modal.remove();
                if((typeof ok).toLowerCase() === 'function'){
                    ok.call();
                }
            },
            onCancel: function () {
                if((typeof cancel).toLowerCase() === 'function'){
                    cancel.call();
                }
            }
        });
        vm.$nextTick(() => {
            const wrap = document.getElementsByClassName('ivu-modal-wrap');
            if(wrap) vm.addClass(wrap[wrap.length - 1], 'wi-modal-confirm');
        });
    };

    /**
     * get cookie
     * @param cname
     * @returns {string}
     */
    Vue.prototype.getCookie = function (cname) {
        const name = cname + '=',
            ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++){
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
    Vue.prototype.setCookie = function (name, value, expire) {
        const d = new Date();
        d.setTime(d.getTime() + (expire * 24 * 60 * 60 * 1000));
        const expires = 'expires=' + d.toUTCString();
        document.cookie = name + '=' + value + ';' + expires;
    };

    /**
     * delete cookie
     * @param name
     */
    Vue.prototype.delCookie = function (name) {
        const d = new Date();
        d.setTime(d.getTime() - (24 * 60 * 60 * 1000));
        const expire = 'expires=' + d.toUTCString();
        document.cookie = name + '="";' + expire;
    };

    /**
     * judge whether it is empty.
     * @param str
     * @returns {boolean}
     */
    Vue.prototype.isEmpty = (str) => {
        if(str === null || str === '' || typeof str === 'undefined'){
            return true;
        }
        return false;
    };
    
    /**
     * empty.
     * @param string
     * @returns {*}
     */
    Vue.prototype.empty = function(string) {
        if(string === null || string === '' || typeof string === 'undefined'){
            return '-';
        }
        return string;
    };

    /**
     * set title for column
     * @param h
     * @param text
     * @returns {*}
     */
    Vue.prototype.tableRender = (h, text,align) => {
        const showText = (text === null || text === '' || typeof text === 'undefined') ? '-' : text;
        return h('div', {
            class: 'common-cell-text',
            style:{
                'text-align':align||'left'
            },
            attrs: {
                title: showText
            }
        }, showText);
    };

    /**
     * calculate width and height
     * @param file
     */
    Vue.prototype.calcWidthHeight = file =>{
        return new Promise((resolve, reject) => {
            try{
                let fileReader = new FileReader();
                fileReader.onload = e => {
                    const data = e.target.result;
                    const image = new Image();
                    image.onload = () => {
                        resolve({
                            width:image.width,
                            height:image.height
                        });
                    };
                    image.src = data;
                };
                fileReader.readAsDataURL(file);
            }catch(e){
                reject(`计算宽高错误:${e}`);
            }
        })
    };

    /**
     * format file size
     * @param size
     * @returns {string}
     */
    Vue.prototype.formatFileSize = size => {
        const units=['B','K','M','G','T','P'];
        let i=0;
        while(size>1024){
            i++;
            size=size/1024;
        }
        return `${size.toFixed(2)}${units[i]}`;
    }
};
