/**
 * @desc global variable. Via [ this.G.title / {{ G.title }} ] to get it in components
 *
 * debug
 * @type {boolean}
 */
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
let user = {};
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
            icon: 'ios-list-box-outline',
            children: [
                {
                    title: 'alpha策略',
                    icon: 'ios-log-in',
                    name: 'alpha',
                    path: '/strategySquare/alpha'
                },
                {
                    title: '股票多头',
                    icon: 'ios-checkmark-circle-outline',
                    name: 'longStocks',
                    path: '/strategySquare/longStocks'
                }, {
                    title: '股票多空',
                    icon: 'ios-log-in',
                    name: 'shortStocks',
                    path: '/strategySquare/shortStocks'
                },
                {
                    title: '期货CTA',
                    icon: 'ios-checkmark-circle-outline',
                    name: 'cta',
                    path: '/strategySquare/cta'
                }, {
                    title: '期权',
                    icon: 'ios-log-in',
                    name: 'option',
                    path: '/strategySquare/option'
                },
                {
                    title: '事件驱动',
                    icon: 'ios-checkmark-circle-outline',
                    name: 'eventDriven',
                    path: '/strategySquare/eventDriven'
                }, {
                    title: '其它',
                    icon: 'ios-log-in',
                    name: 'other',
                    path: '/strategySquare/other'
                }
            ]
        },
        {
            title: '策略研究',
            name: 'strategyResearch',
            icon: 'ios-list-box-outline',
            children: [
                {
                    title: '策略环境',
                    icon: 'ios-log-in',
                    name: 'strategyEnv',
                    path: '/strategyResearch/strategyEnv'
                },
                {
                    title: '策略列表',
                    icon: 'ios-checkmark-circle-outline',
                    name: 'strategyList',
                    path: '/strategyResearch/strategyList'
                }, {
                    title: '单因子分析',
                    icon: 'ios-log-in',
                    name: 'singleFactor',
                    path: '/strategyResearch/singleFactor'
                },
                {
                    title: '我的因子',
                    icon: 'ios-log-in',
                    name: 'myFactor',
                    path: '/strategyResearch/myFactor'
                },
                {
                    title: ' 财务分析',
                    icon: 'ios-log-in',
                    name: 'financialAnalysis',
                    path: '/strategyResearch/financialAnalysis'
                },
                {
                    title: '事件驱动',
                    icon: 'ios-checkmark-circle-outline',
                    name: 'eventDrivenResearch',
                    path: '/strategyResearch/eventDrivenResearch'
                }
            ]
        },
        {
            title: '因子库',
            name: 'factorLibrary',
            icon: 'ios-list-box-outline',
            children: [
                {
                    title: '财务因子',
                    icon: 'ios-log-in',
                    name: 'financialFactor',
                    path: '/factorLibrary/financialFactor'
                },
                {
                    title: '技术因子',
                    icon: 'ios-log-in',
                    name: 'technologyFactor',
                    path: '/factorLibrary/technologyFactor'
                },
                {
                    title: '情绪因子',
                    icon: 'ios-log-in',
                    name: 'emotionFactor',
                    path: '/factorLibrary/emotionFactor'
                },
                {
                    title: '自定义因子',
                    icon: 'ios-log-in',
                    name: 'customFactor',
                    path: '/factorLibrary/customFactor'
                }
            ]
        },
        {
            title: '模拟交易',
            name: 'paperTrading',
            icon: 'ios-list-box-outline',
            children: [
                {
                    title: '策略跟踪',
                    icon: 'ios-log-in',
                    name: 'policyTracking',
                    path: '/paperTrading/policyTracking'
                },
                {
                    title: '账户设置',
                    icon: 'ios-log-in',
                    name: 'accountSetting',
                    path: '/paperTrading/accountSetting'
                },
                {
                    title: '交易设置',
                    icon: 'ios-log-in',
                    name: 'trandSetting',
                    path: '/paperTrading/trandSetting'
                }
            ]
        },
        {
            title: '多维数据',
            name: 'multidimensionalData',
            icon: 'ios-list-box-outline',
            children: [
                {
                    title: '股票',
                    icon: 'ios-log-in',
                    name: 'stock',
                    path: '/multidimensionalData/stock'
                },
                {
                    title: '期货',
                    icon: 'ios-log-in',
                    name: 'futures',
                    path: '/multidimensionalData/futures'
                },
                {
                    title: '期权',
                    icon: 'ios-log-in',
                    name: 'option',
                    path: '/multidimensionalData/option'
                },
                {
                    title: '基金',
                    icon: 'ios-log-in',
                    name: 'fund',
                    path: '/multidimensionalData/fund'
                },
                {
                    title: '债券',
                    icon: 'ios-log-in',
                    name: 'bond',
                    path: '/multidimensionalData/bond'
                },
                {
                    title: '其它',
                    icon: 'ios-log-in',
                    name: 'otherData',
                    path: '/multidimensionalData/otherData'
                }
            ]
        },
        {
            title: '帮助文档',
            name: 'docs',
            icon: 'ios-list-box-outline',
            children: [
                {
                    title: '新手指引',
                    icon: 'ios-log-in',
                    name: 'guide',
                    path: '/docs/guide'
                },
                {
                    title: '常见问题',
                    icon: 'ios-log-in',
                    name: 'problem',
                    path: '/docs/problem'
                },
                {
                    title: 'API文档',
                    icon: 'ios-log-in',
                    name: 'apidoc',
                    path: '/docs/apidoc'
                },
                {
                    title: '函数',
                    icon: 'ios-log-in',
                    name: 'function',
                    path: '/docs/function'
                },
                {
                    title: '因子说明',
                    icon: 'ios-log-in',
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
                    icon: 'ios-log-in',
                    name: 'account',
                    path: '/setting/account'
                },
                {
                    title: '密码设置',
                    icon: 'ios-log-in',
                    name: 'password',
                    path: '/setting/password'
                },
                {
                    title: '账户管理',
                    icon: 'ios-log-in',
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
    user: process.env.AUTH_SERVICES + '/user',
    logout: process.env.AUTH_SERVICES + '/LoginServlet',
    project: process.env.AUTH_SERVICES + '/LoginServlet',
    dimension: process.env.UPLOAD_SERVER + '/dimension/v1/',
    region: process.env.UPLOAD_SERVER + '/region/level-list/',
    draggable: {
        base: '/basic-manager/basic-attribute',
        list: '/module-manager/module/height/{height}/module-list',
        height: '/module-manager/module/height-list',
        template: '/layout-manager/layout/{id}',
	    templates: '/layout-manager/layouts',
        layout: '/rec-group-manager/rec-group/{id}/layout',
        content: '/rec-group-manager/rec-group/{id}/rec-content-list'
    }
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
    accept: {images: 'image/gif, image/jpeg, image/png, image/jpeg'},
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
const footer = 'Copyright &copy; 2018';

export default {
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
