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
          <div class="name">{{name}}</div>
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
          <date-ul class="date-ul"></date-ul>
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
import DateUl from "@/components/dateUl/DateUl";

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
      chartOptions: {},
      res:this.$route.meta.res,
      name:this.$route.meta.name
    };
  },
  components: { DateUl },
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
          res: this.res,
          report: this.name
        }),
        {},
        res => {
          // 转百分比
          res.data.stats = res.data.stats.map(item => {
            return {
              ...item,
              strategy: this.formatPercentage(item.strategy),
              csl: this.formatPercentage(item.csl)
            };
          });

          this.chartDatas.chart1 = res.data.stats || {};
          this.strategyDatas.chart1 = res.data || {};

          let option = {
            tooltip: {
              trigger: "axis",
              backgroundColor: "rgba(255,255,255,0.7)",
              borderColor: "#333",
              borderWidth: 1,
              textStyle: {
                color: "#000000"
              },
              formatter: params => {
                return `${params[0].name}<br/>
                          ${params[0].marker}${params[0].seriesName}: ${
                  params[0].value
                }%<br/>
                          ${params[1].marker}${params[1].seriesName}: ${
                  params[1].value
                }%`;
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
              name: "累计收益",
              type: "value",
              boundaryGap: [0, "100%"],
              position: "right",
              nameRotate: "-90",
              nameLocation: "middle",
              nameGap: 50,
              axisLabel: {
                formatter: "{value}%"
              }
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
    genLineChartOption() {}
  }
};
</script>

<style src="../../style.scss" lang="scss" scoped></style>


