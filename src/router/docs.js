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
    path: '/docs',
    meta: {
      name: '帮助文档'
    },
    component:Main,
    children: [
      {
        path: '/',
        redirect: 'guide'
      },
      {
        path: 'guide',
        meta: {
          name: '新手指引'
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
        path: 'problem',
        meta: {
          name: '常见问题'
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
        path: 'apidoc',
        meta: {
          name: 'API文档'
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
        path: 'function',
        meta: {
          name: '函数'
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
        path: 'factorExplain',
        meta: {
          name: '因子说明'
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
  