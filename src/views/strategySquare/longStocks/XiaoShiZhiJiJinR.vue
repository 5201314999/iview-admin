<!--
Description
@authors liyongjie
@date    2019-05-27 11:51:02
@version 1.0.0
-->
<template>
  <div>
    <div class="strategy-wrapper">
      <div>
        <Card class="outline">
          <div class="name">创业板真价值组合</div>
          <div class="profit">
            <div class="title">累计收益</div>
            <div class="text red">{{formatPercentage(strategyDatas.chart1.accIncome)|formatEmpty}}%</div>
          </div>
          <div class="profit-info">
            <div>
              <div class="title">年化收益</div>
              <div class="text red">{{formatPercentage(strategyDatas.chart1.annualIncome)|formatEmpty}}%</div>
            </div>
            <div>
              <div class="title">基准收益</div>
              <div class="text">{{formatPercentage(strategyDatas.chart1.benchmarkReturn)|formatEmpty}}%</div>
            </div>
            <div>
              <div class="title">最大回撤</div>
              <div class="text">{{formatPercentage(strategyDatas.chart1.maxRetracement)|formatEmpty}}%</div>
            </div>
          </div>
          <div class="info">
            <div>
              <span class="title">起始时间：</span>
              <span>{{strategyDatas.chart1.startDate|formatEmpty}}</span>
            </div>
          </div>
        </Card>

        <Card class="chart-wrapper">
          <div
            ref="chart1"
            style="width:100%;height:100%;"
          ></div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      charts: [],
      chartDatas: {},
      strategyDatas: {
        chart1: {},
        chart2: {},
        chart3: {},
        chart4: {},
        chart5: {},
        chart6: {}
      },
      chartOptions:{}
    };
  },
  components: {},
  created() {
    this.$nextTick(() => {
      // 初始化
      this.init();
      this.$root.$on("resize", () => {
        this.resize();
      });

      // 请求数据
      this.$api.get(
        this.parseUrl(this.G.api.strategy, {
          res: "股票多头",
          report: "创业板真价值组合"
        }),
        {},
        res => {
          res.data.stats = res.data.stats.map(item=>{
            return {
              ...item,
              strategy: this.formatPercentage(item.strategy),
              csl: this.formatPercentage(item.csl)
            }
          })

          this.chartDatas.chart1 = res.data.stats || {};
          this.strategyDatas.chart1 = res.data || {};

          let option = {
            tooltip: {
              trigger: "axis",
              position: function(pt) {
                return [pt[0], "10%"];
              }
            },
            title: {
              left: "20",
              top: 20,
              text: "模拟交易"
            },
            legend: {
              data: [
                { name: "策略", icon: "rect" },
                { name: "基准", icon: "rect" }
              ],
              top: "20",
              right: "50"
            },
            grid: {
              show: true,
              left: 50,
              right: 50,
              top: 60,
              bottom: 60,
              containLabel: true
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              splitLine: {
                show: true
              },
              data: this.chartDatas.chart1.map(function(item) {
                return item.date;
              })
            },
            yAxis: {
              name: "累计收益(%)",
              type: "value",
              boundaryGap: [0, "100%"],
              position: "right",
              nameRotate: "-90",
              nameLocation: "middle",
              nameGap: 30
            },
            dataZoom: [
              {
                type: "inside",
                start: 0,
                end: 100
              },
              {
                start: 0,
                end: 100,
                handleIcon:
                  "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
                handleSize: "80%",
                handleStyle: {
                  color: "#fff",
                  shadowBlur: 3,
                  shadowColor: "rgba(0, 0, 0, 0.6)",
                  shadowOffsetX: 2,
                  shadowOffsetY: 2
                },
                left: 85,
                right: 85
              }
            ],
            series: [
              {
                name: "策略",
                type: "line",
                smooth: true,
                symbol: "none",
                sampling: "average",
                itemStyle: {
                  color: "rgb(58, 161, 255)"
                },
                areaStyle: {
                  color: "rgba(58, 161, 255,.5)"
                },
                data: this.chartDatas.chart1.map(function(item) {
                  return item.strategy;
                })
              },
              {
                name: "基准",
                type: "line",
                smooth: true,
                symbol: "none",
                sampling: "average",
                itemStyle: {
                  color: "rgb(242, 99, 123)"
                },
                data: this.chartDatas.chart1.map(function(item) {
                  return item.csl;
                })
              }
            ]
          };

          this.charts[0].setOption(option);
        },
        err => {}
      );
    });
  },
  methods: {
    init() {
      this.charts[0] = this.$echarts.init(this.$refs.chart1);
    },
    resize() {
      this.charts.map(chart => {
        chart.resize();
      });
    },
    formatPercentage(num) {
      if (this.isEmpty(num)) {
        return null;
      }
      return (num * 100).toFixed(2);
    },
    genLineChartOption(){

    },

  }
};
</script>

<style lang="scss" scoped>
.strategy-wrapper {
  display: flex;
  justify-content: center;
  > div {
    max-width: 1400px;
    width: 100%;
    display: flex;
    .outline {
      /deep/ .ivu-card-body {
        padding: 0;
      }
      margin-right: 20px;
      flex: 1;
      min-width: 370px;
      max-width: 380px;
      .name {
        font-size: 20px;
        font-weight: 600;
        padding: 30px 20px;
      }
      .profit {
        padding: 0 20px 30px 20px;
        .text {
          font-size: 32px;
          font-weight: 600;
        }
      }
      .profit-info {
        padding: 20px 0;
        display: flex;
        border: 1px solid #eee;
        border-left: 0;
        border-right: 0;
        & > div {
          flex: 1;
          padding-left: 20px;
          &:not(:last-child) {
            border-right: 1px solid #eee;
          }
        }
        .text {
          font-size: 24px;
          font-weight: 600;
        }
      }
      .info {
        padding: 30px 20px;
        & > div {
          .title {
            display: inline-block;
            width: 70px;
            text-align-last: justify;
          }
          &:not(:last-child) {
            margin-bottom: 16px;
          }
          span:nth-child(2) {
            font-size: 18px;
          }
        }
      }
    }
    .chart-wrapper {
      flex: 2;
      /deep/ .ivu-card-body {
        height: 100%;
        padding: 0;
      }
    }
  }
}
</style>

