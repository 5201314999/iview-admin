/**
 * Description
 * @authors fanjiongrong (fanjiongrong@tvflnet.com)
 * @date    2018-10-22 16:44:41
 * @version 1.0.0
 */

const Main= () => import('@/views//Main');
const Container= () => import('@/views/Container');

const Alpha= ()=> import('@/views/strategySquare/alpha/Alpha');
const LongStocks= () => import('@/views/strategySquare/longStocks/LongStocks');
const ShortStocks= () => import('@/views/strategySquare/shortStocks/ShortStocks');
const CTA=() => import('@/views/strategySquare/cta/CTA');
const Option= () => import('@/views/strategySquare/option/Option');
const EventDriven= () => import('@/views/strategySquare/eventDriven/EventDriven');
const Other= () => import('@/views/strategySquare/other/Other');

export default {
    path: '/strategySquare',
    meta: {
      name: '策略广场'
    },
    component:Main,
    children: [
      {
        path: '/',
        redirect: 'alpha'
      },
      {
        path: 'alpha',
        meta: {
          name: 'alpha策略'
        },
        component: Container,
        children: [
          {
            path: '/',
            component: Alpha
          }
        ]
      },
      {
        path: 'longStocks',
        meta: {
          name: '股票多头'
        },
        component: Container,
        children: [
          {
            path: '/',
            component: LongStocks
          }
        ]
      },
      {
        path: 'shortStocks',
        meta: {
          name: '股票多空'
        },
        component: Container,
        children: [
          {
            path: '/',
            component: ShortStocks
          }
        ]
      },
      {
        path: 'cta',
        meta: {
          name: '期货CTA'
        },
        component: Container,
        children: [
          {
            path: '/',
            component: CTA
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
            component: Option
          }
        ]
      },
      {
        path: 'eventDriven',
        meta: {
          name: '事件驱动'
        },
        component: Container,
        children: [
          {
            path: '/',
            component: EventDriven
          }
        ]
      },
      {
        path: 'other',
        meta: {
          name: '其它'
        },
        component: Container,
        children: [
          {
            path: '/',
            component: Other
          }
        ]
      }
    ]
  };
  