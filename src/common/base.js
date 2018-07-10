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
        let that = this;
        that.$api.get(this.G.api.user, {}, function(res){
            if(res['ret']['retCode'].toString() === '0'){
                that.$set(that.G, 'user', res.data);
                that.$emit('get-user-success');
            }
        });
    };

    /**
     * logout
     * @returns {null}
     */
    Vue.prototype.logout = function(){
        this.$api.get(this.G.api.logout, {}, function(res){
            if(res['ret']['retCode'].toString() === '0'){
                alert('退出成功');
            }
        }, function(err){
            alert(err['ret']['retMsg']);
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
            for(let i in params){
                if(params.hasOwnProperty(i)){
                    let reg = '/\{' + i + '\}/g';
                    url.replace(eval(reg), params[i]);
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
        if(!this.hasClass(obj, cls)){
            obj.className += ' ' + cls;
        }
    };

    /**
     * remove class
     * @param obj
     * @param cls
     */
    Vue.prototype.removeClass = function(obj, cls){
        if(this.hasClass(obj, cls)){
            let reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        }
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
        let that = this;
        this.$Modal.confirm({
            title: title,
            content: content,
            width: width,
            closable: true,
            loading: true,
            onOk: function(){
                that.$Modal.remove();
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
     * success
     * @param content
     * @param ok
     * @param width
     * @param title
     */
    Vue.prototype.$success = function(content, ok, width, title){
        title = title ? title : '温馨提示';
        width = width ? width : 360;
        this.$Modal.success({
            title: title,
            content: content,
            width: width,
            closable: true,
            onOk: function(){
                setTimeout(function(){
                    ok.call();
                }, 300)
            }
        });
    };
};
