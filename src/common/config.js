/**
 * debug
 * @type {boolean}
 */
const debug = true;
/**
 * @desc global variable. Via [ this.G.title / {{ G.title }} ] to get it in components
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
 * @type {{app: null, soa: null, mapping: {app: string, soa: string}}}
 */
let id = {
    app: null,
    soa: null,
    mapping: {
        app: 'appId',
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
            title: '表单',
            name: 'form',
            icon: 'md-list',
            children: [
                {
                    title: 'Input 输入框',
                    icon: 'ios-create-outline',
                    name: 'input',
                    path: '/input'
                },
                {
                    title: 'Radio 单选框',
                    icon: 'ios-radio-button-on',
                    name: 'radio',
                    path: '/radio'
                },
                {
                    title: 'Checkbox 多选框',
                    icon: 'ios-checkbox-outline',
                    name: 'checkbox',
                    path: '/checkbox'
                },
                {
                    title: 'Select 选择',
                    icon: 'ios-arrow-dropdown',
                    name: 'select',
                    path: '/select'
                },
                {
                    title: 'Table 表格',
                    icon: 'ios-grid',
                    name: 'table',
                    path: '/table'
                },
                {
                    title: 'Cascader 级联选择',
                    icon: 'ios-more-outline',
                    name: 'cascader',
                    path: '/cascader'
                },
                {
                    title: 'DatePicker 日期选择',
                    icon: 'ios-calendar-outline',
                    name: 'date',
                    path: '/date'
                },
                {
                    title: 'TimePicker 时间选择',
                    icon: 'ios-clock-outline',
                    name: 'time',
                    path: '/time'
                },
                {
                    title: 'Upload 上传',
                    icon: 'ios-cloud-upload-outline',
                    name: 'upload',
                    path: '/upload'
                },
                {
                    title: 'Draggable 拖拽',
                    icon: 'ios-browsers-outline',
                    name: 'draggable',
                    path: '/draggable'
                }
            ]
        },
        {
            title: '视图',
            name: 'view',
            icon: 'ios-alert-outline',
            children: [
                {
                    title: 'Alert 警告提示',
                    icon: 'ios-warning-outline',
                    name: 'alert',
                    path: '/alert'
                },
                {
                    title: 'Message 全局提示',
                    icon: 'ios-close-circle-outline',
                    name: 'message',
                    path: '/message'
                }
            ]
        },
        {
            title: '日志',
            name: 'log',
            icon: 'ios-list-box-outline',
            children: [
                {
                    title: '登录日志',
                    icon: 'ios-log-in',
                    name: 'login',
                    path: '/login'
                },
                {
                    title: '操作日志',
                    icon: 'ios-checkmark-circle-outline',
                    name: 'operation',
                    path: 'operation'
                }
            ]
        }
    ],
    active: 'input',
    open: ['form'],
    collapsed: false
};
/**
 * api
 * @type {{login: string, user: string, logout: string}}
 */
const api = {
    login: 'user/login/{sid}',
    user: '/user',
    logout: '/LoginServlet'
};
/**
 * file's configuration
 * @type {{serve: {upload: *, download: *}, accept: {image: string}}}
 */
const files = {
    serve: {
        upload: process.env.UPLOAD_SERVER,
        download: process.env.FILE_SERVER
    },
    accept: {
        image: 'image/gif, image/jpeg, image/png, image/jpeg'
    }
};
/**
 * content(popup)
 * @type {string}
 */
let content = `<div class="wi-modal-confirm-body-icon"></div>`;
/**
 * footer
 * @type {string}
 */
const footer = 'Copyright &copy; 2018';

export default {
    debug,
    title,
    user,
    id,
    logo,
    menu,
    api,
    files,
    content,
    footer
}
