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
const title = '基础框架';
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
            title: '基础组件',
            name: 'basic',
            icon: 'md-list',
            children: [
                {
                    title: 'Form 表单',
                    icon: 'ios-create-outline',
                    name: 'input',
                    path: '/basic/form'
                },
                {
                    title: 'Table 表格',
                    icon: 'ios-grid',
                    name: 'table',
                    path: '/basic/table'
                },
                {
                    title: 'Cascader 级联选择',
                    icon: 'ios-more-outline',
                    name: 'cascader',
                    path: '/basic/cascader'
                },
                {
                    title: 'DatePicker 日期选择',
                    icon: 'ios-calendar-outline',
                    name: 'date',
                    path: '/basic/date'
                },
                {
                    title: 'TimePicker 时间选择',
                    icon: 'ios-clock-outline',
                    name: 'time',
                    path: '/basic/time'
                }
            ]
        },
        {
            title: '扩展组件',
            name: 'extend',
            icon: 'ios-alert-outline',
            children: [
                {
                    title: 'Upload 上传',
                    icon: 'ios-cloud-upload-outline',
                    name: 'upload',
                    path: '/extend/upload'
                },
                {
                    title: 'Draggable 拖拽',
                    icon: 'ios-browsers-outline',
                    name: 'draggable',
                    path: '/extend/draggable'
                },
                {
                    title: 'transfer 穿梭框',
                    icon: 'ios-swap',
                    name: 'transfer',
                    path: '/extend/transfer'
                }
            ]
        },
        {
            title: '日志',
            name: 'logs',
            icon: 'ios-list-box-outline',
            children: [
                {
                    title: '登录日志',
                    icon: 'ios-log-in',
                    name: 'login',
                    path: '/logs/login'
                },
                {
                    title: '操作日志',
                    icon: 'ios-checkmark-circle-outline',
                    name: 'operation',
                    path: '/logs/operation'
                }
            ]
        }
    ],
    active: 'form',
    open: ['basic'],
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
