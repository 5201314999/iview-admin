/**
 * @desc global variable. Via [ this.G.title / {{ G.title }} ] to get it in components
 *
 * debug
 * @type {boolean}
 */
import Vue from 'vue';
const debug = false;
/**
 * embed
 * removed `Header` and `Sider` and `Breadcrumb`.
 * @type {boolean}
 */
const embed = false;
/**
 * title
 * @type {string}
 */
const title = '黄鹄科技策略量化平台';
/**
 * user information( 初始化后覆盖 )
 * @type {{}}
 */
let user = {
    name: '罗杰'
};
/**
 * site logo
 * @type {null}
 */
let logo = null;
/**
 * identification.
 * @type {{app: null, soa: null, pro: null, mapping: {app: string, pro: string, soa: string}}}
 */
let id = {
    app: null,
    soa: null,
    pro: null,
    mapping: {
        app: 'appid',
        pro: 'proId',
        soa: 'soaProId'
    }
};
/**
 * left-hand menu
 * @type {{items: *[], active: string, open: string[], collapsed: boolean}}
 */
let menu = {
    items: [
        {
            title: '策略广场',
            name: 'strategySquare',
            icon: 'ios-square',
            children: [
                {
                    title: 'alpha策略',
                    // icon: 'logo-octocat',
                    name: 'alpha',
                    path: '/strategySquare/alpha'
                },
                {
                    title: '股票多头',
                    // icon: 'ios-checkmark-circle-outline',
                    name: 'longStocks',
                    path: '/strategySquare/longStocks'
                }, {
                    title: '股票多空',
                    // icon: 'ios-podium-outline',
                    name: 'shortStocks',
                    path: '/strategySquare/shortStocks'
                },
                {
                    title: '期货CTA',
                    // icon: 'ios-help-buoy-outline',
                    name: 'cta',
                    path: '/strategySquare/cta'
                }, {
                    title: '期权',
                    // icon:'ios-color-palette-outline',
                    name: 'option',
                    path: '/strategySquare/option'
                },
                {
                    title: '事件驱动',
                    // icon: 'logo-twitch',
                    name: 'eventDriven',
                    path: '/strategySquare/eventDriven'
                }, {
                    title: '其它',
                    // icon: 'ios-thunderstorm-outline',
                    name: 'other',
                    path: '/strategySquare/other'
                }
            ]
        },
        {
            title: '策略研究',
            name: 'strategyResearch',
            icon: 'ios-star-half',
            children: [
                {
                    title: '策略环境',
                    // icon: 'ios-chatboxes-outline',
                    name: 'strategyEnv',
                    path: '/strategyResearch/strategyEnv'
                },
                {
                    title: '策略列表',
                    // icon: 'ios-podium-outline',
                    name: 'strategyList',
                    path: '/strategyResearch/strategyList'
                }, {
                    title: '单因子分析',
                    // icon: 'ios-radio-button-off',
                    name: 'singleFactor',
                    path: '/strategyResearch/singleFactor'
                },
                {
                    title: '我的因子',
                    // icon: 'ios-baseball-outline',
                    name: 'myFactor',
                    path: '/strategyResearch/myFactor'
                },
                {
                    title: ' 财务分析',
                    // icon: 'md-cash',
                    name: 'financialAnalysis',
                    path: '/strategyResearch/financialAnalysis'
                },
                {
                    title: '事件驱动',
                    // icon: 'logo-twitch',
                    name: 'eventDrivenResearch',
                    path: '/strategyResearch/eventDrivenResearch'
                }
            ]
        },
        {
            title: '因子库',
            name: 'factorLibrary',
            icon: 'ios-funnel-outline',
            children: [
                {
                    title: '财务因子',
                    // icon: 'ios-funnel-outline',
                    name: 'financialFactor',
                    path: '/factorLibrary/financialFactor'
                },
                {
                    title: '技术因子',
                    // icon: 'ios-bulb-outline',
                    name: 'technologyFactor',
                    path: '/factorLibrary/technologyFactor'
                },
                {
                    title: '情绪因子',
                    // icon: 'ios-bonfire-outline',
                    name: 'emotionFactor',
                    path: '/factorLibrary/emotionFactor'
                },
                {
                    title: '自定义因子',
                    // icon: 'ios-build-outline',
                    name: 'customFactor',
                    path: '/factorLibrary/customFactor'
                }
            ]
        },
        {
            title: '模拟交易',
            name: 'paperTrading',
            icon: 'ios-boat',
            children: [
                {
                    title: '策略跟踪',
                    // icon: 'ios-glasses-outline',
                    name: 'policyTracking',
                    path: '/paperTrading/policyTracking'
                },
                {
                    title: '账户设置',
                    // icon: 'ios-ice-cream-outline',
                    name: 'accountSetting',
                    path: '/paperTrading/accountSetting'
                },
                {
                    title: '交易设置',
                    // icon: 'ios-link-outline',
                    name: 'trandSetting',
                    path: '/paperTrading/trandSetting'
                }
            ]
        },
        {
            title: '多维数据',
            name: 'multidimensionalData',
            icon: 'ios-card-outline',
            children: [
                {
                    title: '股票',
                    // icon: 'ios-card-outline',
                    name: 'stock',
                    path: '/multidimensionalData/stock'
                },
                {
                    title: '期货',
                    // icon: 'ios-help-buoy-outline',
                    name: 'futures',
                    path: '/multidimensionalData/futures'
                },
                {
                    title: '期权',
                    // icon: 'ios-color-palette-outline',
                    name: 'option',
                    path: '/multidimensionalData/option'
                },
                {
                    title: '基金',
                    // icon: 'ios-medal-outline',
                    name: 'fund',
                    path: '/multidimensionalData/fund'
                },
                {
                    title: '债券',
                    // icon: 'ios-outlet-outline',
                    name: 'bond',
                    path: '/multidimensionalData/bond'
                },
                {
                    title: '其它',
                    // icon: 'ios-thunderstorm-outline',
                    name: 'otherData',
                    path: '/multidimensionalData/otherData'
                }
            ]
        },
        {
            title: '帮助文档',
            name: 'docs',
            icon: 'ios-bookmarks-outline',
            children: [
                {
                    title: '新手指引',
                    // icon:'ios-restaurant-outline',
                    name: 'guide',
                    path: '/docs/guide'
                },
                {
                    title: '常见问题',
                    // icon: 'ios-help-circle-outline',
                    name: 'problem',
                    path: '/docs/problem'
                },
                {
                    title: 'API文档',
                    // icon: 'ios-construct-outline',
                    name: 'apidoc',
                    path: '/docs/apidoc'
                },
                {
                    title: '函数',
                    // icon: 'ios-log-in',
                    name: 'function',
                    path: '/docs/function'
                },
                {
                    title: '因子说明',
                    // icon: 'ios-information-circle-outline',
                    name: 'factorExplain',
                    path: '/docs/factorExplain'
                },
            ]
        },
        {
            title: '设置',
            name: 'setting',
            icon: 'ios-list-box-outline',
            children: [
                {
                    title: '账户设置',
                    // icon: 'ios-person-outline',
                    name: 'account',
                    path: '/setting/account'
                },
                {
                    title: '密码设置',
                    // icon: 'ios-lock-outline',
                    name: 'password',
                    path: '/setting/password'
                },
                {
                    title: '账户管理',
                    // icon: 'ios-man-outline',
                    name: 'accountManage',
                    path: '/setting/accountManage'
                }
            ]
        }

    ],
    active: 'alpha',
    open: ['strategySquare'],
    collapsed: false
};
/**
 * api
 * @type {{user: string, logout: string, project: string}}
 */
const api = {
    strategy: '/stat/res/{res}/report-form/{report}'
};
/**
 * file's configuration
 * @type {{server: {download: (string), upload: (string)}, format: {images: string[], videos: string[]}, accept: {images: string}}}
 */
const files = {
    server: {
        upload: process.env.UPLOAD_SERVER,
        download: process.env.FILE_SERVER
    },
    accept: { images: 'image/gif, image/jpeg, image/png, image/jpeg' },
    format: {
        images: ['jpg', 'jpeg', 'png', 'gif'],
        videos: ['mp4', 'mkv', 'ts']
    }
};
/**
 * {name: cookie's name; expire: expiry date;}
 * note: ( unit:day )
 * @type {{collapse: {name: string, expire: number}}}
 */
const cookie = {
    collapse: {
        name: 'layout-theme-menu-collapsed',
        expire: 1
    }
};
/**
 * adapter.
 * @type {{type: string, span: number}}
 */
let adapter = {
    type: 'l',
    span: 8
};
/**
 * reg
 * @type {{uri: RegExp, mac: RegExp, url: RegExp}}
 */
const regExps = {
    mac: /^((([A-F0-9\d]{2}:[A-F0-9\d]{2}:[A-F0-9\d]{2}:[A-F0-9\d]{2}:[A-F0-9\d]{2}:[A-F0-9\d]{2})[\n])*([A-F0-9\d]{2}:[A-F0-9\d]{2}:[A-F0-9\d]{2}:[A-F0-9\d]{2}:[A-F0-9\d]{2}:[A-F0-9\d]{2}))$/,
    url: /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/,
    uri: /^([A-Za-z][A-Za-z0-9+\-.]*):(?:(\/\/)(?:((?:[A-Za-z0-9\-._~!$&'()*+,;=:]|%[0-9A-Fa-f]{2})*)@)?((?:\[(?:(?:(?:(?:[0-9A-Fa-f]{1,4}:){6}|::(?:[0-9A-Fa-f]{1,4}:){5}|(?:[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,1}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){3}|(?:(?:[0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){2}|(?:(?:[0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}:|(?:(?:[0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})?::)(?:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(?:(?:[0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})?::)|[Vv][0-9A-Fa-f]+\.[A-Za-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[A-Za-z0-9\-._~!$&'()*+,;=]|%[0-9A-Fa-f]{2})*))(?::([0-9]*))?((?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)|\/((?:(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)?)|((?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)|)(?:\?((?:[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9A-Fa-f]{2})*))?(?:\#((?:[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9A-Fa-f]{2})*))?$/
};
/**
 * footer
 * @type {string}
 */
const footer = 'Copyright &copy; 2019 黄鹄科技';

export default new Vue({
    data: {
        debug,
        embed,
        title,
        user,
        id,
        logo,
        menu,
        api,
        files,
        cookie,
        regExps,
        adapter,
        footer
    }
})
