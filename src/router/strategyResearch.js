/**
 * Description
 * @authors fanjiongrong (fanjiongrong@tvflnet.com)
 * @date    2018-10-22 16:44:41
 * @version 1.0.0
 */

const Main= () => import('@/views//Main');
const Container= () => import('@/views/Container');
const StrategyEnv= () => import('@/views/strategyResearch/strategyEnv/StrategyEnv');

const Todo= ()=> import('@/views/Todo');

export default {
    path: '/strategyResearch',
    meta: {
      name: '策略研究'
    },
    component:Main,
    children: [
      {
        path: '/',
        redirect: 'strategyEnv'
      },
      {
        path: 'strategyEnv',
        meta: {
          name: '策略环境'
        },
        component: Container,
        children: [
          {
            path: '/',
            component: StrategyEnv
          }
        ]
      },
      {
        path: 'strategyList',
        meta: {
          name: '策略列表'
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
        path: 'singleFactor',
        meta: {
          name: '单因子分析'
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
        path: 'myFactor',
        meta: {
          name: '我的因子'
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
        path: 'financialAnalysis',
        meta: {
          name: '财务分析'
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
        path: 'eventDrivenResearch',
        meta: {
          name: '事件驱动'
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
  