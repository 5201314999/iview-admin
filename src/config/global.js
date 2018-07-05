/**
 * @project app
 * @author lirongtong <lirongtong@hotmail.com>
 * @github: https://github.com/wildidea
 * @date 2018-6-21 15:06
 *
 * @desc 全局变量, 组件内访问 [ this.G.user.name / {{ G.user.name }} ]
 */
const title = '基础框架DEMO';

/**
 * 用户信息(初始化后覆盖)
 * @type {{name: string}}
 */
const user = {};

/**
 * 左侧菜单
 * @type {{items: *[], active: string, open: string[], collapsed: boolean}}
 */
const menu = {
    items: [
        {
            title: '首页',
            name: 'home',
            icon: 'ios-home-outline',
            children: [
                {
                    title: '表格（Table）',
                    name: 'table',
                    path: '/table'
                },
                {
                    title: '分页（Page）',
                    name: 'pagination',
                    path: '/pagination'
                },
                {
                    title: '表单（Form）',
                    name: 'form',
                    path: '/form'
                },
                {
                    title: '详情（Detail）',
                    name: 'detail',
                    path: '/detail'
                }
            ]
        }
    ],
    active: 'table',
    open: ['home'],
    collapsed: false
};

const accept = {
    images: 'image/gif, image/jpeg, image/png, image/jpeg'
};

/**
 * API
 * @type {*}
 */
const api = {
    user: 'user/getLoginUser',
    logout: 'user/logout',
    getRecModuleList:'/rec-module-manager/rec-module-list',
    addStyleComponent:'/rec-module-manager/rec-module/',
    getLayoutList:'/rec-layout-manager/rec-layout-list',
    getGroupList:'/rec-group-manager/rec-group-list',
    pages: {
        list: '/page-manager/page-list',
        create: '/page-manager/page',
        detail: '/page-manager/page',
        delete: '/page-manager/page/{page-id}',
        state: '/page-manager/page/{page-id}/change-state/{state}'
    }
};

/**
 * footer content
 * @type {string}
 */
const footer = 'Copyright &copy; 2018';

export default {
    title,
    user,
    menu,
    api,
    footer,
    accept
}