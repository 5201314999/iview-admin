import axios from 'axios';
axios.defaults.withCredentials = true;

const DOMAIN = process.env.DOMAIN;
const AUTH = process.env.AUTH_SERVICES;

/**
 * send request.
 * @param method
 * @param url
 * @param params
 * @param success
 * @param failure
 * @param config
 *
 * @see get
 * @see post
 * @see put
 * @see delete
 * @see patch
 * @see custom
 */
function base(method, url, params, success, failure, config) {
    method = method.toUpperCase();
    let configuration = {
        method: method,
        url: url,
        data: params,
        baseURL: DOMAIN,
        timeout: 30000
    };
    if(method === 'GET' && params !== null){
        delete configuration.data;
        configuration.params = params;
    }
    if(config && Object.keys(config).length > 0){
        for(let i in config){
            if(config.hasOwnProperty(i)){
                configuration[i] = config[i];
            }
        }
    }
    axios(configuration).then((res) => {
        if(res.data['ret'] && res.data['ret']['retCode'] && res.data['ret']['retCode'].toString() === 'A001'){
            setTimeout(() => {
                window.location.href = AUTH;
            }, 2500);
        }else{
            if((typeof success).toUpperCase() === 'FUNCTION') success(res.data);
        }
    }).catch((err) => {
        if((typeof failure).toUpperCase() === 'FUNCTION') failure(err);
    });
}

export default {
    /**
     * get
     * @param url
     * @param params
     * @param success
     * @param failure
     * @param config
     */
    get: function(url, params, success, failure, config) {
        return base('GET', url, params, success, failure, config);
    },

    /**
     * post
     * @param url
     * @param params
     * @param success
     * @param failure
     * @param config
     * @returns {*}
     */
    post: function(url, params, success, failure, config) {
        return base('POST', url, params, success, failure, config);
    },

    /**
     * put
     * @param url
     * @param params
     * @param success
     * @param failure
     * @param config
     */
    put: function(url, params, success, failure, config) {
        return base('PUT', url, params, success, failure, config);
    },

    /**
     * delete
     * @param url
     * @param params
     * @param success
     * @param failure
     * @param config
     */
    delete: function(url, params, success, failure, config) {
        return base('DELETE', url, params, success, failure, config);
    },

    /**
     * patch
     * @param url
     * @param params
     * @param success
     * @param failure
     * @param config
     */
    patch: function(url, params, success, failure, config) {
        return base('PATCH', url, params, success, failure, config);
    },

    /**
     * custom
     * @param method
     * @param url
     * @param params
     * @param success
     * @param failure
     * @param config
     */
    custom: function(method, url, params, success, failure, config) {
        return base(method, url, params, success, failure, config);
    },
}
