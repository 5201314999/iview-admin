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
    path: '/factorLibrary',
    meta: {
      name: '因子库'
    },
    component:Main,
    children: [
      {
        path: '/',
        redirect: 'financialFactor'
      },
      {
        path: 'financialFactor',
        meta: {
          name: '财务因子'
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
        path: 'technologyFactor',
        meta: {
          name: '技术因子'
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
        path: 'emotionFactor',
        meta: {
          name: '情绪因子'
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
  