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
    path: '/multidimensionalData',
    meta: {
      name: '多维数据'
    },
    component:Main,
    children: [
      {
        path: '/',
        redirect: 'stock'
      },
      {
        path: 'stock',
        meta: {
          name: '股票'
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
        path: 'futures',
        meta: {
          name: '期货'
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
        path: 'option',
        meta: {
          name: '期权'
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
        path: 'fund',
        meta: {
          name: '基金'
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
        path: 'bond',
        meta: {
          name: '债券'
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
        path: 'otherData',
        meta: {
          name: '其它'
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
  