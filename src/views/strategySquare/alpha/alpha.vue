<!--
Description
@authors fanjiongrong (fanjiongrong@tvflnet.com)
@date    2019-05-27 10:58:35
@version 1.0.0
-->
<template>
  <div class="page">
    <div class="model">
      <div class="sider-info">
        <header>
          {{resName|formatEmpty}}
        </header>
        <div class="sp-data">
          <div class="title">累计收益</div>
          <div class="value">{{totalInfo.accIncome|formatEmpty}}%</div>
        </div>
        <div class="row-info">
         
          <div class="group">
            <p class="label">年化收益</p>
            <p class="value red">{{totalInfo.benchmarkReturn|formatEmpty}}%</p>
          </div>
           <div class="group">
            <p class="label">基准收益</p>
            <p class="value">{{totalInfo.benchmarkReturn|formatEmpty}}%</p>
          </div>
           <div class="group">
            <p class="label">最大回撤</p>
            <p class="value">{{totalInfo.maxRetracement|formatEmpty}}%</p>
          </div>
        </div>
        <div class="extra-info">
          <div class="group">
            <span class="label">起始时间：</span>
            <span class="value">{{totalInfo.startDate|formatEmpty}}</span>
          </div>
        </div>
      </div>
      <div class="chart-wrapper">
        <date-ul class="date-ul"></date-ul>
        <div class="chart alpha1"></div>
      </div>
    </div>
   
  </div>
</template>

<script>
  import DateUl from '@/components/dateUl/DateUl';
  export default {
    components: {
      DateUl
    },
    data() {
      return {
        chartsObj: {},

        // 白马量化对冲1号
        resName:'',
        totalInfo: {
          accIncome: 0,    // 累计收益
          benchmarkReturn: 0, // 基准收益
          annualIncome: 0, // 年化收益
          maxRetracement: 0, // 最大回撤
          startDate: '-'
        }


      }
    },
    mounted() {
      this.resName=this.$route.meta.name;
      this.chartsObj.alpha1 = this.$echarts.init(document.querySelector('.alpha1'));
      this.getData();
      this.$root.$on('resize', this.handleChartResize);
    },
    methods: {
      //响应式
      handleChartResize() {
        this.$nextTick(() => {
          for (const i in this.chartsObj) {
            if (this.chartsObj.hasOwnProperty(i)) {
              this.chartsObj[i].resize();
            }
          }
        });
      },
      //白马量化1号数据
      getData() {
        const url = this.parseUrl(this.G.api.strategy, {
          res: this.$route.meta.res,
          report: this.resName
        });
        this.$api.get(url, {}, res => {
          if (res.ret.retCode === '0') {
            //左侧信息
            this.totalInfo = {
              accIncome: res.data.accIncome?(res.data.accIncome*100).toFixed(2):'',
              benchmarkReturn: res.data.benchmarkReturn?(res.data.benchmarkReturn*100).toFixed(2):'',
              annualIncome: res.data.annualIncome?(res.data.annualIncome*100).toFixed(2):'',
              maxRetracement: res.data.maxRetracement?(res.data.maxRetracement*100).toFixed(2):'',
              startDate: res.data.startDate
            }
            //图表数据
            let date = [];
            let csl = [];
            let strategy = [];
            res.data.stats.forEach(e => {
              date.push(e.date);
              csl.push((e.csl * 100).toFixed(2));
              strategy.push((e.strategy * 100).toFixed(2));
            });
            const option = {
              color: ['rgb(58, 161, 255)', 'rgb(242, 99, 123)'],
              title: {
                text: '模拟交易',
                top: 20,
                left: 20,
                textStyle: {
                  fontSize: 20,
                  color: 'rgba(0,0,0,0.85)',
                }
              },
              grid: {
                show: true,
                bottom:60,
                top: 60,
                left: 50,
                right: 50,
                containLabel:true
              },
              tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(255,255,255,0.7)',
                borderColor: '#333',
                borderWidth: 1,
                textStyle: {
                  color: '#000000'
                },
                formatter: params => {
                  return `${params[0].name}<br/>
                          ${params[0].marker}${params[0].seriesName}: ${params[0].value}%<br/>
                          ${params[1].marker}${params[1].seriesName}: ${params[1].value}%`;
                }
              },
              legend: {
                top: 20,
                right: 40,
                data: [{
                  name: '策略',
                  icon: 'rect',
                }, {
                  name: '基准',
                  icon: 'rect'
                }]
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: date,
                splitLine: {
                  show: true
                }
              },
              yAxis: {
                type: 'value',
                boundaryGap: [0, '100%'],
                position: 'right',
                name: '累计收益',
                nameGap: 50,
                nameLocation: 'center',
                nameRotate: 270,
                axisLabel: {
                  formatter: '{value}%'
                }
              },
              dataZoom: [{
                type: 'inside',
                start: 0,
                end: 100
              }, {
                start: 0,
                end: 100,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                  color: '#fff',
                  shadowBlur: 3,
                  shadowColor: 'rgba(0, 0, 0, 0.6)',
                  shadowOffsetX: 2,
                  shadowOffsetY: 2
                },
                left: 85,   
                right: 85
              }],
              series: [
                {
                  name: '策略',
                  type: 'line',
                  smooth: true,
                  symbol: 'none',
                  sampling: 'average',
                  itemStyle: {
                    color: 'rgb(255, 70, 131)'
                  },
                  areaStyle: {
                    color: 'rgba(58, 161, 255,.5)'
                  },
                  data: strategy
                },
                {
                  name: '基准',
                  type: 'line',
                  smooth: true,
                  symbol: "none",
                  sampling: "average",
                  itemStyle: {
                    color: "rgb(242, 99, 123)"
                  },
                  data: csl
                }
              ]
            };
            this.chartsObj.alpha1.setOption(option);
          }
          else {
            this.$error(res.ret.retMsg);
          }
        }, err => {
          this.$error('出现异常');
        });

      }
    }

  }
</script>

<style lang="scss" scoped>
  
</style>
