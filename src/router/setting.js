/**
 * Description
 * @authors fanjiongrong (fanjiongrong@tvflnet.com)
 * @date    2018-10-22 16:44:41
 * @version 1.0.0
 */

const Main= () => import('@/views//Main');
const Container= () => import('@/views/Container');

const Todo= ()=> import('@/views/Todo');

export default {
    path: '/setting',
    meta: {
      name: '设置'
    },
    component:Main,
    children: [
      {
        path: '/',
        redirect: 'account'
      },
      {
        path: 'account',
        meta: {
          name: '账户设置'
        },
        component: Container,
        children: [
          {
            path: '/',
            component: Todo
          }
        ]
      },
      {
        path: 'password',
        meta: {
          name: '密码设置'
        },
        component: Container,
        children: [
          {
            path: '/',
            component: Todo
          }
        ]
      },
      {
        path: 'accountManage',
        meta: {
          name: '账户管理'
        },
        component: Container,
        children: [
          {
            path: '/',
            component: Todo
          }
        ]
      },
      {
        path: 'customFactor',
        meta: {
          name: '自定义因子'
        },
        component: Container,
        children: [
          {
            path: '/',
            component: Todo
          }
        ]
      }
    ]
  };
  