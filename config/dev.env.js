'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    SERVER_NAME: '"https://dev-cms-operation.tvflnet.com"'
});
