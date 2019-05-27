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
    path: '/paperTrading',
    meta: {
      name: '模拟交易'
    },
    component:Main,
    children: [
      {
        path: '/',
        redirect: 'policyTracking'
      },
      {
        path: 'policyTracking',
        meta: {
          name: '策略跟踪'
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
        path: 'accountSetting',
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
        path: 'trandSetting',
        meta: {
          name: '交易设置'
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
  