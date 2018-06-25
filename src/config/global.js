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
const user = {
    name: '李荣通'
};

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
                    name: 'preview',
                    path: 'preview'
                },
                {
                    title: '操作日志',
                    name: 'log',
                    path: 'log'
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
                    name: 'page',
                    path: 'page'
                },
                {
                    title: '标签管理',
                    name: 'tab',
                    path: 'tab'
                }
            ]
        },
        {
            title: '专题运营',
            name: 'special-topic',
            icon: 'android-globe',
            children: [
                {
                    title: '专题页管理',
                    name: 'special',
                    path: 'special'
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
                    name: 'recommend-group',
                    path: 'recommend/group'
                },
                {
                    title: '推荐组样式管理',
                    name: 'recommend-style',
                    path: 'recommend/style'
                },
                {
                    title: '组件库管理',
                    name: 'recommend-component',
                    path: 'recommend/component'
                }
            ]
        }
    ],
    active: 'preview',
    open: ['control'],
    collapsed: false
};

/**
 * API
 * @type {*}
 */
const api = {
    user: 'user/getLoginUser',
    logout: 'user/logout'
};

/**
 * 面包屑(默认)
 * @type {*[]}
 */
const breadcrumb = [{path: '/', title: '首页', icon: 'ios-home-outline'}];

export default {
    title,
    user,
    menu,
    breadcrumb,
    api
}