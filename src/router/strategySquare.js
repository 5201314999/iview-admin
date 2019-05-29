/**
 * Description
 * @authors fanjiongrong (fanjiongrong@tvflnet.com)
 * @date    2018-10-22 16:44:41
 * @version 1.0.0
 */

const Main = () => import("@/views//Main");
const Container = () => import("@/views/Container");

// alpha 策略
// const BaiMaLiangHuaDuiChong1Hao = () => import("@/views/strategySquare/alpha/BaiMaLiangHuaDuiChong1Hao");
// const ChaoJiYinLiYinZiZuHe = () => import("@/views/strategySquare/alpha/ChaoJiYinLiYinZiZuHe");
// const JiaZhIHongLiWenYinZuHe = () => import("@/views/strategySquare/alpha/JiaZhIHongLiWenYinZuHe");
// const WenJin300 = () => import("@/views/strategySquare/alpha/WenJin300");
// const GaoChengZhangR = () => import("@/views/strategySquare/alpha/GaoChengZhangR");

const Alpha = () => import("@/views/strategySquare/alpha/alpha");


// 股票多头
const ChuangYeBanZhenJiaZhiZhuHe = () => import("@/views/strategySquare/longStocks/ChuangYeBanZhenJiaZhiZhuHe");
const XiaoShiZhiJiJinR = () => import("@/views/strategySquare/longStocks/XiaoShiZhiJiJinR");
const DaiWeiSiShuanJi = () => import("@/views/strategySquare/longStocks/DaiWeiSiShuanJi");
const FenXianQiYeChengZhangZuHe = () => import("@/views/strategySquare/longStocks/FenXianQiYeChengZhangZuHe");
const YinHangGaoJiaZhiLunDong = () => import("@/views/strategySquare/longStocks/YinHangGaoJiaZhiLunDong");
const RenGongZhiNengZuHe = () => import("@/views/strategySquare/longStocks/RenGongZhiNengZuHe");

// 股票多空
const LiangJiaGuaiDian = () => import("@/views/strategySquare/shortStocks/LiangJiaGuaiDian");
const JiQiXueXiZuHe = () => import("@/views/strategySquare/shortStocks/JiQiXueXiZuHe");
const XieTiaoBanZhuangCeLue = () => import("@/views/strategySquare/shortStocks/XieTiaoBanZhuangCeLue");
const JiBenMianDuoYinZi = () => import("@/views/strategySquare/shortStocks/JiBenMianDuoYinZi");


// 期货CTA
const QiHuoQuanPinZhongCeLueR = () => import("@/views/strategySquare/cta/QiHuoQuanPinZhongCeLueR");
const SAR = () => import("@/views/strategySquare/cta/SAR");
const RBreaker = () => import("@/views/strategySquare/cta/RBreaker");
const GaiJinHaiGuiJiaoYiCeLue = () => import("@/views/strategySquare/cta/GaiJinHaiGuiJiaoYiCeLue");

// 期权
const WuFengXiangTaoLi = () => import("@/views/strategySquare/option/WuFengXiangTaoLi");
const BoDongLvTaoLi = () => import("@/views/strategySquare/option/BoDongLvTaoLi");
const DateGaoPinStrategy = () => import("@/views/strategySquare/option/DateGaoPinStrategy");
const Delta = () => import("@/views/strategySquare/option/Delta");
const Vega = () => import("@/views/strategySquare/option/Vega");

// 事件驱动
const ChengFenGuTiaoZheng = () => import("@/views/strategySquare/eventDriven/ChengFenGuTiaoZheng");
const GaoZhuangSong = () => import("@/views/strategySquare/eventDriven/GaoZhuangSong");
const NianBaoMaiFu = () => import("@/views/strategySquare/eventDriven/NianBaoMaiFu");
const YeJiYuZengZuHe = () => import("@/views/strategySquare/eventDriven/YeJiYuZengZuHe");

// 其它
const FenJiA = () => import("@/views/strategySquare/other/FenJiA");
const KeZhuangZhaiTaoLi = () => import("@/views/strategySquare/other/KeZhuangZhaiTaoLi");


export default {
  path: "/strategySquare",
  meta: {
    name: "策略广场"
  },
  component: Main,
  children: [
    {
      path: "/",
      redirect: "alpha"
    },
    {
      path: "alpha",
      meta: {
        name: "alpha策略"
      },
      redirect: "alpha/baiMaLiangHuaDuiChong1Hao",
      component: Container,
      children: [
        {
          path: "baiMaLiangHuaDuiChong1Hao",
          component: Alpha,
          meta: {
            res: "alpha策略",
            name: "白马量化对冲1号"
          }
        },
        {
          path: "chaoJiYinLiYinZiZuHe",
          component: Alpha,
          meta: {
            res: "alpha策略",
            name: "超级盈利因子组合"
          }
        },
        {
          path: "jiaZhIHongLiWenYinZuHe",
          component: Alpha,
          meta: {
            res: "alpha策略",
            name: "价值红利稳赢组合"
          }
        },
        {
          path: "wenJin300",
          component: Alpha,
          meta: {
            res: "alpha策略",
            name: "稳进300"
          }
        },
        {
          path: "gaoChengZhangR",
          component: Alpha,
          meta: {
            res: "alpha策略",
            name: "高成长R"
          }
        }
      ]
    },
    {
      path: "longStocks",
      meta: {
        name: "股票多头"
      },
      component: Container,
      redirect: "longStocks/chuangYeBanZhenJiaZhiZhuHe",
      children: [
        {
          path: "chuangYeBanZhenJiaZhiZhuHe",
          component: ChuangYeBanZhenJiaZhiZhuHe,
          meta: {
            res: "股票多头",
            name: "创业板真价值组合"
          }
        },
        {
          path: "xiaoShiZhiJiJinR",
          component: XiaoShiZhiJiJinR,
          meta: {
            res: "股票多头",
            name: "小市值激进R"
          }
        },
        {
          path: "daiWeiSiShuanJi",
          component: DaiWeiSiShuanJi,
          meta: {
            res: "股票多头",
            name: "戴维斯双击"
          }
        },
        {
          path: "fenXianQiYeChengZhangZuHe",
          component: FenXianQiYeChengZhangZuHe,
          meta: {
            res: "股票多头",
            name: "分享企业成长组合"
          }
        },
        {
          path: "yinHangGaoJiaZhiLunDong",
          component: YinHangGaoJiaZhiLunDong,
          meta: {
            res: "股票多头",
            name: "银行高价值轮动"
          }
        },
        {
          path: "renGongZhiNengZuHe",
          component: RenGongZhiNengZuHe,
          meta: {
            res: "股票多头",
            name: "人工智能组合"
          }
        }
      ]
    },
    {
      path: "shortStocks",
      meta: {
        name: "股票多空"
      },
      component: Container,
      children: [
        {
          path: "liangJiaGuaiDian",
          component: LiangJiaGuaiDian,
          meta: {
            res: "股票多空",
            name: "量价拐点"
          }
        },
        {
          path: "jiQiXueXiZuHe",
          component: JiQiXueXiZuHe,
          meta: {
            res: "股票多空",
            name: "机器学习组合"
          }
        },
        {
          path: "xieTiaoBanZhuangCeLue",
          component: XieTiaoBanZhuangCeLue,
          meta: {
            res: "股票多空",
            name: "协整搬砖策略"
          }
        },
        {
          path: "jiBenMianDuoYinZi",
          component: JiBenMianDuoYinZi,
          meta: {
            res: "股票多空",
            name: "基本面多因子"
          }
        }
      ]
    },
    {
      path: "cta",
      meta: {
        name: "期货CTA"
      },
      component: Container,
      children: [
        {
          path: "qiHuoQuanPinZhongCeLueR",
          component: QiHuoQuanPinZhongCeLueR,
          meta: {
            res: "期货CTA",
            name: "期货全品种策略R"
          }
        },
        {
          path: "SAR",
          component: SAR,
          meta: {
            res: "期货CTA",
            name: "SAR组合"
          }
        },
        {
          path: "RBreaker",
          component: RBreaker,
          meta: {
            res: "期货CTA",
            name: "RBreaker组合"
          }
        },
        {
          path: "gaiJinHaiGuiJiaoYiCeLue",
          component: GaiJinHaiGuiJiaoYiCeLue,
          meta: {
            res: "期货CTA",
            name: "改进海龟交易策略"
          }
        }
      ]
    },
    {
      path: "option",
      meta: {
        name: "期权"
      },
      component: Container,
      children: [
       
        {
          path: "wuFengXiangTaoLi",
          component: WuFengXiangTaoLi,
          meta: {
            res: "期权",
            name: "无风险套利"
          }
        },
        {
          path: "boDongLvTaoLi",
          component: BoDongLvTaoLi,
          meta: {
            res: "期权",
            name: "波动率套利"
          }
        },
        {
          path: "dateGaoPinStrategy",
          component: DateGaoPinStrategy,
          meta: {
            res: "期权",
            name: "日内高频策略"
          }
        },
        {
          path: "Delta",
          component: Delta,
          meta: {
            res: "期权",
            name: "Delta对冲策略"
          }
        },
        {
          path: "Vega",
          component: Vega,
          meta: {
            res: "期权",
            name: "Vega策略"
          }
        },
      ]
    },
    {
      path: "eventDriven",
      meta: {
        name: "事件驱动"
      },
      component: Container,
      children: [
        {
          path: "chengFenGuTiaoZheng",
          component: ChengFenGuTiaoZheng,
          meta: {
            res: "事件驱动",
            name: "成分股调整埋伏"
          }
        },
        {
          path: "gaoZhuangSong",
          component: GaoZhuangSong,
          meta: {
            res: "事件驱动",
            name: "高送转组合"
          }
        },
        {
          path: "nianBaoMaiFu",
          component: NianBaoMaiFu,
          meta: {
            res: "事件驱动",
            name: "年报埋伏"
          }
        },
        {
          path: "yeJiYuZengZuHe",
          component: YeJiYuZengZuHe,
          meta: {
            res: "事件驱动",
            name: "业绩预增组合"
          }
        }
      ]
    },
    {
      path: "other",
      meta: {
        name: "其它"
      },
      component: Container,
      children: [
        {
          path: "fenJiA",
          component: FenJiA,
          meta: {
            res: "其它",
            name: "分级A轮动"
          }
        },
        {
          path: "keZhuangZhaiTaoLi",
          component: KeZhuangZhaiTaoLi,
          meta: {
            res: "其它",
            name: "可转债套利"
          }
        }
      ]
    }
  ]
};
