/**
 * @project app
 * @author lirongtong <lirongtong@hotmail.com>
 * @github: https://github.com/wildidea
 * @date 2018-6-21 15:06
 *
 * @desc 全局变量, 组件内访问 [ this.G.user.name / {{ G.user.name }} ]
 */
const title = '影视运营系统';

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
            title: '控制台',
            name: 'control',
            icon: 'ios-speedometer-outline',
            children: [
                {
                    title: '预览效果',
                    name: 'previews',
                    path: '/previews'
                },
                {
                    title: '操作日志',
                    name: 'logs',
                    path: '/logs'
                }
            ]
        },
        {
            title: 'Launcher 运营',
            name: 'launcher',
            icon: 'android-laptop',
            children: [
                {
                    title: '页面管理',
                    name: 'pages',
                    path: '/pages'
                },
                {
                    title: '标签管理',
                    name: 'tabs',
                    path: '/tabs'
                }
            ]
        },
        {
            title: '专题运营',
            name: 'specials',
            icon: 'android-globe',
            children: [
                {
                    title: '专题页管理',
                    name: 'specials',
                    path: '/specials'
                }
            ]
        },
        {
            title: '推荐组库',
            name: 'recommend',
            icon: 'ios-photos-outline',
            children: [
                {
                    title: '推荐组管理',
                    name: 'group',
                    path: '/recommend/group'
                },
                {
                    title: '推荐组布局管理',
                    name: 'style',
                    path: '/recommend/style'
                },
                {
                    title: '样式组件库',
                    name: 'component',
                    path: '/recommend/component'
                }
            ]
        }
    ],
    active: 'previews',
    open: ['control'],
    collapsed: false
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
    footer
}