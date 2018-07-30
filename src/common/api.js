/**
 * @project app
 * @author lirongtong <lirongtong@hotmail.com>
 * @github: https://github.com/wildidea
 * @date 2018-6-19 9:11
 */

import axios from 'axios';
const server = process.env.SERVER_NAME;

/**
 * element type
 * @param o
 * @returns {string}
 */
function toType(o){
    return ({}).toString.call(o).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

/**
 * filter parameters
 * @param o
 * @returns {*}
 */
function filter_trim(o){
    for(let k in o){
        if(o.hasOwnProperty(k)){
            if(o[k] == null){
                delete o[k];
            }
            if(toType(o[k]) === 'string'){
                o[k] = o[k].trim();
                if(o[k].length === 0){
                    delete o[k];
                }
            }
        }
    }
    return o;
}

/**
 * send request
 * @param method
 * @param url
 * @param params
 * @param success
 * @param failure
 * @param _config
 * @private
 */
function _base(method, url, params, success, failure, _config){
    if(params){
        params = filter_trim(params);
    }else{
        params = {};
    }
    let config = {
        method: method,
        url: url,
        data: params,
        baseURL: server,
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        timeout: 3000
    };
    if(_config && Object.keys(_config).length > 0){
        for(let i in _config){
            if(_config.hasOwnProperty(i)){
                config[i] = _config[i];
            }
        }
    }
    axios(config).then(function(response){
        if((typeof success).toLowerCase() === 'function'){
            success(response.data);
        }
    }).catch(function(error){
        if((typeof failure).toLowerCase() === 'function'){
            failure(error);
        }
    });
}

export default {
    /**
     * GET
     * @param url
     * @param params
     * @param success
     * @param failure
     * @param config
     */
    get: function(url, params, success, failure, config){
        return _base('GET', url, params, success, failure, config);
    },

    /**
     * POST
     * @param url
     * @param params
     * @param success
     * @param failure
     * @param config
     */
    post: function(url, params, success, failure, config){
        return _base('POST', url, params, success, failure, config);
    },

    /**
     * PUT
     * @param url
     * @param params
     * @param success
     * @param failure
     * @param config
     */
    put: function(url, params, success, failure, config){
        return _base('PUT', url, params, success, failure, config);
    },

    /**
     * DELETE
     * @param url
     * @param params
     * @param success
     * @param failure
     * @param config
     */
    delete: function(url, params, success, failure, config){
        return _base('DELETE', url, params, success, failure, config);
    },

    /**
     * PATCH
     * @param url
     * @param params
     * @param success
     * @param failure
     * @param config
     */
    patch: function(url, params, success, failure, config){
        return _base('PATCH', url, params, success, failure, config);
    },

    /**
     * CUSTOM
     * @param url
     * @param method
     * @param params
     * @param success
     * @param failure
     * @param config
     */
    custom: function(url, method, params, success, failure, config){
        return _base(method, url, params, success, failure, config);
    }
};
