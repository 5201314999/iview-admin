<!--
Description
@authors fanjiongrong (fanjiongrong@tvflnet.com)
@date    2019-05-27 10:58:35
@version 1.0.0
-->
<template>
  <div>
    <Row :gutter="16">
      <Col span="8" class="sider-info">
        <div class="main">
          <header>
            白马量化对冲1号
          </header>
          <div class="sp-data">
            <div class="title">累计收益</div>
            <div class="value">147.69%</div>
          </div>
          <div class="row-info">
              <div class="group">
                  <p class="label">基准收益</p>
                  <p class="value">21.09%</p>
              </div>
              <div class="group">
                  <p class="label">年化收益</p>
                  <p class="value">22.09%</p>
              </div>
          </div>
          <div class="row-info">
              <div class="group">
                  <p class="label">最大回撤</p>
                  <p class="value">30.09%</p>
              </div>
          </div>
        </div>
      </Col>
      <Col span="16" class="chart-wrapper">
        <header>模拟收益率</header>
        <div class="chart alpha1"></div>
      </Col>
    </Row>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        chartsObj: {},
      }
    },
    mounted() {
      this.chartsObj.alpha1 = this.$echarts.init(document.querySelector('.alpha1'));
      this.getBaiMaLiangHua1HaoData();
       window.onresize = () => {
        this.handleChartResize();
      };
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
      getBaiMaLiangHua1HaoData() {
        const date = ['2014-03-13', '2014-03-14', '2014-03-15', '2014-03-16', '2014-03-17', '2014-03-18'];
        const ydata1 = [98, 99, 4, 5, 40, 70];
        const ydata2 = [1.06, 1.07, 1.08, 3, 6, 7, 10, 12];
        const option = {
          tooltip: {
            trigger: 'axis',
            position: function (pt) {
              return [pt[0], '10%'];
            }
          },
          title: {
            left: 'center',
            text: '大数据量面积图',
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, '100%']
          },
          dataZoom: [{
            type: 'inside',
            start: 0,
            end: 10
          }, {
            start: 0,
            end: 10,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 3,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }],
          series: [
            {
              name: '数据1',
              type: 'line',
              smooth: true,
              symbol: 'none',
              sampling: 'average',
              itemStyle: {
                color: 'rgb(255, 70, 131)'
              },
              areaStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgb(255, 158, 68)'
                }, {
                  offset: 1,
                  color: 'rgb(255, 70, 131)'
                }])
              },
              data: ydata1
            },
            {
              name: '数据2',
              type: 'line',
              smooth: true,
              symbol: 'none',
              data: ydata2
            }
          ]
        };
        this.chartsObj.alpha1.clear();
        this.chartsObj.alpha1.setOption(option, true);
      }
    }

  }
</script>

<style lang="scss" scoped>
  header{
      height:40px;
      line-height:40px;
      padding-left:16px;
      border-bottom: 1px solid #DEDEDE;
      border-left:5px solid #1b8ee4;
      font-size:16px;
      font-weight:bold;
  }
  .sider-info {
    .main{
       background-color:#ffffff;
       min-height:440px;
    }
    .sp-data{
      padding: 16px;
      .value{
        margin-top:8px;
        font-size:28px;
        color:red;
        font-weight:bold;
      }
    }
    .row-info{
      display:flex;
      border-top:1px solid #e9e9e9;
      padding:16px 0;
      .group{
        padding-left:16px;
        flex-grow:1;
        &:nth-of-type(2){
          border-left:1px solid #e9e9e9;
        }
        .label{
        
        }
        .value{
          font-size:18px;
          font-weight:600;
        }
      }
    }
  }
  .chart-wrapper {
    background-color:#ffffff;
    .chart {
      height: 400px;
    }
  }
</style>
