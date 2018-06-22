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
 * @private
 */
function _base(method, url, params, success, failure){
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
    get: function(url, params, success, failure){
        return _base('GET', url, params, success, failure);
    },
    post: function(url, params, success, failure){
        return _base('POST', url, params, success, failure);
    },
    put: function(url, params, success, failure){
        return _base('PUT', url, params, success, failure);
    },
    delete: function(url, params, success, failure){
        return _base('DELETE', url, params, success, failure);
    },
    patch: function(url, params, success, failure){
        return _base('PATCH', url, params, success, failure);
    },
    custom: function(url, method, params, config, success, failure){
        return _base(method, url, config, params, success, failure);
    }
};