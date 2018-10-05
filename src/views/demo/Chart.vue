<!--
Description echart 使用demo,仅供参考
@authors fanjiongrong (fanjiongrong@tvflnet.com)
@date    2018-10-05 10:55:03
@version 1.0.0
-->
<template>
  <div class="fl-container">
    <div class="fl-content" id="chart-demo">
      <div class="chart-item-wrapper">
        <div class="bl-header">
          <h2>折线图</h2>
        </div>
        <div class="remark">
          <span class="item">子标题</span>
          <tool-box :btnList="lineBtnList" v-model="activeLineBtn" @on-change="changeActiveLineBtn"></tool-box>
        </div>
        <div class="chart-item line-analysis"></div>
        <div v-show="noLineData" class="no-data-tip">暂无数据</div>
      </div>
      <div class="chart-item-wrapper">
        <div class="bl-header">
          <h2>柱状图</h2>
        </div>
        <div class="remark">
          <span class="item">子标题</span>
          <tool-box :btnList="barBtnList" v-model="activeBarBtn" @on-change="changeActiveBarBtn"></tool-box>
        </div>
        <div class="chart-item bar-analysis" ref="bar-analysis"></div>
        <div v-show="noBarData" class="no-data-tip">暂无数据</div>
      </div>
      <div class="chart-item-wrapper">
        <div class="bl-header">
          <h2>2级地图</h2>
        </div>
        <div class="remark">
          <tool-box :btnList="regionBtnList" v-model="activeRegionBtn" @on-change="changeActiveRegionBtn"></tool-box>
        </div>
        <Row :gutter="20">
          <Col :span="8">
          <div class="chart-item region-bar">
          </div>
          </Col>
          <Col :span="16" class="map-col">
          <div class="chart-item region-analysis" ref="region-analysis">
          </div>
          <div class="backProvince" title="返回全国地图" v-show="targetProvince !== ''" @click="backChina">
            <Icon type="ios-undo"></Icon>
          </div>
          </Col>
        </Row>
      </div>
    </div>
  </div>
  </div>
</template>

<script>

  import ToolBox from '@/components/toolBox/ToolBox';
  export default {
    components: {
      ToolBox
    },
    data() {
      let barFileds = [];
      for (let i = 1; i < 20; i++) {
        barFileds.push(i);
      }
      barFileds.push('20+');
      return {
        echartColors: ['#1890FF', '#2FC25B', '#FACC14', '#13C2C2', '#F04864', '#8543E0'], //该参数使用范围较广的话应放置在全局配置参数里
        lineBtnList: [{
          value: '0',
          label: '菜单一',
        }, {
          value: '1',
          label: '菜单二',
        }, {
          value: '2',
          label: '菜单三',
        }],
        activeLineBtn: '0',

        barBtnList: [{
          value: '0',
          label: '菜单一',
        }, {
          value: '1',
          label: '菜单二',
        }],
        activeBarBtn: '0',
        barFileds: barFileds,

        regionBtnList: [{
          value: '0',
          label: '菜单一',
        }, {
          value: '1',
          label: '菜单二',
        }, {
          value: '2',
          label: '菜单三',
        }],
        activeRegionBtn: '0',
        regionData: {},

        chartsObj: {},

        //无数据时提示暂无数据的标志
        noLineData: false,
        noBarData: false,

        provinces: {
          //23个省
          "台湾": "taiwan",
          "河北": "hebei",
          "山西": "shanxi",
          "辽宁": "liaoning",
          "吉林": "jilin",
          "黑龙江": "heilongjiang",
          "江苏": "jiangsu",
          "浙江": "zhejiang",
          "安徽": "anhui",
          "福建": "fujian",
          "江西": "jiangxi",
          "山东": "shandong",
          "河南": "henan",
          "湖北": "hubei",
          "湖南": "hunan",
          "广东": "guangdong",
          "海南": "hainan",
          "四川": "sichuan",
          "贵州": "guizhou",
          "云南": "yunnan",
          "陕西": "shanxi1",
          "甘肃": "gansu",
          "青海": "qinghai",
          //5个自治区
          "新疆": "xinjiang",
          "广西": "guangxi",
          "内蒙古": "neimenggu",
          "宁夏": "ningxia",
          "西藏": "xizang",
          //4个直辖市
          "北京": "beijing",
          "天津": "tianjin",
          "上海": "shanghai",
          "重庆": "chongqing",
          //2个特别行政区
          "香港": "xianggang",
          "澳门": "aomen"
        },

        //不需要加载2级地图的地方(其实除了台湾，其他地方在地图上也点不到。。)
        specialRegion: [
          //4个直辖市
          "北京",
          "天津",
          "上海",
          "重庆",
          //2个特别行政区
          "香港",
          "澳门",

          "台湾"
        ],

        allCitys: [], //记载前端存的所有城市
        regionId: '', //记录打开省份的id 前2位
        targetProvince: '', // 记录打开省份的中文名

        //地图自适应问题用宽度不行的，需要用高度固定，宽度自适应的省份
        heightProvince: [
          '海南',
          '山西',
          '陕西',
          '河北',
          '湖南'
        ]
      };
    },
    mounted() {
      this.chartsObj.lineChart = this.$echarts.init(document.querySelector('.line-analysis'));
      this.chartsObj.barChart = this.$echarts.init(document.querySelector('.bar-analysis'));
      this.chartsObj.regionBarChart = this.$echarts.init(document.querySelector('.region-bar'));
      this.chartsObj.regionChart = this.$echarts.init(document.querySelector('.region-analysis'));
      //echart 2级钻探
      const vm = this;
      this.chartsObj.regionChart.on('click', function (params) {
        if (!vm.isSpecialRegion(params.data.name) && vm.regionId==='') {
          //demo 数据，实际应动态赋值
          vm.targetProvince = '福建';
          vm.regionId = '1';
        }
        else {
          vm.targetProvince = '';
          vm.regionId = '';
        }
        vm.getRegionData();
      });
      this.setMapOption();
      this.setRegionBarOption();

      window.onresize = () => {
        this.handleChartResize();
      };
      this.$root.$on('resize', this.handleChartResize);

      //折线图参数配置
      this.setLine();

      //柱状图图参数配置
      this.setBar();

      //2级地图
      this.getRegionData();
    },
    beforeDestroy() {
      this.$root.$off('resize', this.handleChartResize);
    },
    methods: {
      backChina() {
        this.regionId = '';
        this.targetProvince = '';
        this.getRegionData();
      },
      /**
       * 自适应
       */
      handleChartResize() {
        this.$nextTick(() => {
          for (const i in this.chartsObj) {
            if (i === 'regionChart') {
              //判断是高度特别高的省份
              if (this.targetProvince !== '' && this.heightProvince.find(e => { return this.targetProvince === e })) {
                const mapHeight = document.querySelector('.region-analysis').clientHeight;
                this.mapOption.series[0].mapWidth && delete this.mapOption.series[0].mapWidth;
                this.mapOption.series[0].mapHeight = mapHeight;
              }
              else {
                const mapWidth = document.querySelector('.region-analysis').clientWidth - 40 < document.querySelector('.region-analysis').clientHeight ? (document.querySelector('.region-analysis').clientWidth - 40) * 0.8 : document.querySelector('.region-analysis').clientHeight;
                this.mapOption.series[0].mapHeight && delete this.mapOption.series[0].mapHeight;
                this.mapOption.series[0].mapWidth = mapWidth;
              }
              this.chartsObj[i].setOption(this.mapOption);
              this.chartsObj[i].resize();
            }
            else {
              this.chartsObj[i].resize();
            }
          }
        });
      },
      /**
       * 设置地图的配置
       */
      setMapOption() {
        this.mapOption = {
          color: this.echartColors,
          tooltip: {
            backgroundColor: 'rgba(255,255,255,0.7)',
            borderColor: '#333',
            borderWidth: 1,
            textStyle: {
              color: '#000000'
            }
          },
          grid: [{
            left: 0,
            top: 0,
            bottom: 20,
            containLabel: true
          }],
          visualMap: {
            min: 0,
            max: 10000,
            bottom: 20,
            itemHeight: "150",
            text: ['高', '低'], // 文本，默认为数值文本
            calculable: true,
            color: ['#f7a831', '#f9eedd'],
          },
        };
      },
      /**
       * 折线图
       */
      setLine() {
        const option = {
          color: this.echartColors,
          grid: {
            top: 10,
            left: 40,
            right: 40,
            bottom: 20,
            containLabel: true,
          },
          tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255,255,255,0.7)',
            borderColor: '#333',
            borderWidth: 1,
            textStyle: {
              color: '#000000'
            }
          },
          xAxis: {
            type: 'category',
            data: ['2018-01-10', '2018-01-11', '2018-01-12', '2018-01-13', '2018-01-14', '2018-01-15', '2018-01-16', '2018-01-17', '2018-01-18'],
            boundaryGap: false,
            axisTick: {
              show: true,
              alignWithLabel: true
            },
          },
          yAxis: {
            type: 'value',
            splitLine: {
              lineStyle: {
                type: 'dotted'
              }
            }
          },
          series: [
            {
              data: [1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800],
              type: 'line',
              smooth: true
            }
          ]
        };
        this.chartsObj.lineChart.setOption(option, true);
      },
      setBar() {
        const option = {
          color: this.echartColors,
          tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255,255,255,0.7)',
            borderColor: '#333',
            borderWidth: 1,
            textStyle: {
              color: '#000000'
            }
          },
          grid: [{
            left: 20,
            top: 20,
            bottom: 20,
            right: 20,
            containLabel: true
          }],
          xAxis: {
            type: 'category',
            data: this.barFileds,
            axisTick: {
              show: false,
              alignWithLabel: true
            },
            axisLabel: {//坐标轴刻度标签的相关设置。
              interval: 0,
            }
          },
          yAxis: {
            type: 'value',
            splitLine: {
              lineStyle: {
                type: 'dotted'
              }
            }
          },
          series: [
            {
              data: [100, 12, 14, 15, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 21, 12],
              type: 'bar',
              smooth: true,
              barWidth: 30,
              barMaxWidth: 30,
            }
          ]
        };
        this.chartsObj.barChart.setOption(option, true);
      },
      /**
       * 地图（数据只为展示效果写死了2种情况，实际开发结合情况修改）
       */
      getRegionData() {
        if(this.regionId===''){
          this.regionData = [{ "regionId": 110000, "name": "北京", value: 1401 },
          { "regionId": 120000, "name": "天津", value: 1401},
          { "regionId": 130000, "name": "河北", value: 1401 },
          { "regionId": 140000, "name": "山西", value: 1401 },
          { "regionId": 150000, "name": "内蒙古", value: 1401 },
          { "regionId": 210000, "name": "辽宁", value: 1401 },
          { "regionId": 220000, "name": "吉林", value: 1401 },
          { "regionId": 230000, "name": "黑龙江", value: 1401 },
          { "regionId": 310000, "name": "上海", value: 1401 },
          { "regionId": 320000, "name": "江苏", value: 1401 },
          { "regionId": 330000, "name": "浙江", value: 1401 },
          { "regionId": 340000, "name": "安徽", value: 1401 },
          { "regionId": 350000, "name": "福建", value: 1401 },
          { "regionId": 360000, "name": "江西", value: 1401 },
          { "regionId": 370000, "name": "山东", value: 1401 },
          { "regionId": 410000, "name": "河南", value: 1401 },
          { "regionId": 420000, "name": "湖北", value: 1401 },
          { "regionId": 430000, "name": "湖南", value: 1401 },
          { "regionId": 440000, "name": "广东", value: 1401 },
          { "regionId": 450000, "name": "广西", value: 1401 },
          { "regionId": 460000, "name": "海南", value: 1401 },
          { "regionId": 500000, "name": "重庆", value: 1401 },
          { "regionId": 510000, "name": "四川", value: 1401 },
          { "regionId": 520000, "name": "贵州", value: 1401 },
          { "regionId": 530000, "name": "云南", value: 1401 },
          { "regionId": 540000, "name": "西藏", value: 1401 },
          { "regionId": 610000, "name": "陕西", value: 2000 },
          { "regionId": 620000, "name": "甘肃", value: 1401 },
          { "regionId": 630000, "name": "青海", value: 1401 },
          { "regionId": 640000, "name": "宁夏", value: 1401 },
          { "regionId": 650000, "name": "新疆", value: 1401 },
          { "regionId": 710000, "name": "台湾", value: 1401 },
          { "regionId": 810000, "name": "香港", value: 1401 },
          { "regionId": 820000, "name": "澳门", value: 1401 }];
        }
        else{
           this.regionData =
          [{"regionId":350000,"name":"福建",value: 300},
           {"regionId":350100,"name":"福州",value: 300},
           {"regionId":350200,"name":"厦门",value: 300},
           {"regionId":350300,"name":"莆田",value: 300},
           {"regionId":350400,"name":"三明",value: 300},
           {"regionId":350500,"name":"泉州",value: 300},
           {"regionId":350600,"name":"漳州",value: 300},
           {"regionId":350700,"name":"南平",value: 300},
           {"regionId":350800,"name":"龙岩",value: 300},
           {"regionId":350900,"name":"宁德",value: 300}];
        }
        this.changeActiveRegionBtn(this.activeRegionBtn);
      },
      changeActiveLineBtn(value) {

      },
      changeActiveBarBtn(value) {

      },
      changeActiveRegionBtn(value) {
        let compare = function (obj1, obj2) {
          if (obj1.value > obj2.value) {
            return 1;
          }
          else if (obj1.value === obj2.value) {
            return 0;
          }
          else {
            return -1;
          }
        };

        //bar 图初始化
        this.regionData.sort(compare);
        const yfield = this.regionData.map(e => e.name)
        this.regionBarOption.yAxis.data = yfield;
        const values = this.regionData.map(e => e.value)
        this.regionBarOption.series.data = values;
        this.chartsObj.regionBarChart.setOption(this.regionBarOption);

        //需要动态设置高度（规则是数量少于10的 , 数量*40，大于10的，高度100%）
        if (values.length < 10) {
          document.querySelector('.region-bar').style.height = values.length * 40 + 'px';
        }
        else {
          document.querySelector('.region-bar').style.height = '580px';
        }
        this.chartsObj.regionBarChart.resize();

        //地图 初始化
        //加载省
        if (this.regionId === '') {
          this.$api.get('static/map/json/china.json', {}, json => {
            this.$echarts.registerMap('china', json);
            this.$nextTick(() => {
              this.renderMap('china', this.regionData);
            });
          }, err => { }, { baseURL: '/' });
        }
        //加载市级
        else {
          const fileName = this.provinces[this.targetProvince];
          this.$api.get(`static/map/json/province/${fileName}.json`, {}, json => {
            this.$echarts.registerMap(this.targetProvince, json);
            this.$nextTick(() => {
              this.renderMap(this.targetProvince, this.regionData);
            });
          }, err => {

          }, { baseURL: '/' });
        }
      },
      /**
       * 判断是否是特殊的省份
       */
      isSpecialRegion(name) {
        const item = this.specialRegion.find(e => {
          return e.indexOf(name) >= 0;
        })
        if (item) {
          return true;
        }
        return false;
      },
      /**
       * 获取前端标准的城市名称
       */
      getFormatCityName(cityName) {
        const formatName = this.allCitys.find(e => {
          return e.indexOf(cityName) >= 0;
        })
        return formatName || cityName;
      },
      renderMap(map, data) {
        this.mapOption.series = [{
          name: this.activeRegionBtn,
          type: 'map',
          map: map,
          itemStyle: {
            areaColor: '#FFF9D2'
          },
          data: data
        }];

        //判断是高度特别高的省份
        if (this.targetProvince !== '' && this.heightProvince.find(e => { return this.targetProvince === e })) {
          const mapHeight = document.querySelector('.region-analysis').clientHeight;
          this.mapOption.series[0].mapWidth && delete this.mapOption.series[0].mapWidth;
          this.mapOption.series[0].mapHeight = mapHeight;
        }
        else {
          const mapWidth = document.querySelector('.region-analysis').clientWidth - 40 < document.querySelector('.region-analysis').clientHeight ? (document.querySelector('.region-analysis').clientWidth - 40) * 0.8 : document.querySelector('.region-analysis').clientHeight;
          this.mapOption.series[0].mapHeight && delete this.mapOption.series[0].mapHeight;
          this.mapOption.series[0].mapWidth = mapWidth;
        }

        this.mapOption.visualMap.max = data[data.length - 1].value || 10000;
        this.mapOption.visualMap.min = data[0].value || 0;
        this.chartsObj.regionChart.setOption(this.mapOption);
      },
      setRegionBarOption() {
        let vm = this;
        this.regionBarOption = {
          color: this.echartColors,
          grid: [{
            left: 20,
            top: 0,
            right: 100,
            bottom: 20,
            containLabel: true
          }],
          xAxis: {
            type: 'value',
            splitLine: {
              show: false
            },
            show: false
          },
          yAxis: {
            type: 'category',
            data: [],
            axisTick: {
              show: false,
              alignWithLabel: true
            }
          },
          series: {
            type: 'bar',
            barMaxWidth: 20,
            label: {
              show: true,
              position: 'right',
              data: [],
              formatter: (params) => {
                if (vm.regionData) {
                  const obj = vm.regionData.find(e => {
                    return e.name === params.name;
                  })
                  return  obj.value;
                }
                else {
                  return ''
                }

              }
            }
          }
        };
      }
    }
  }
</script>

<style lang="scss" scoped>
  .fl-content {
    background-color: unset;
    padding: 5px;
  }
  #chart-demo {
    .bl-header {
      overflow: hidden;
      border-bottom: 1px solid rgb(232, 232, 232);
      padding-left: 20px;
      padding-right: 20px;
      background-color: #ffffff;
      box-sizing: border-box;
      height: 53px;
      h2 {
        float: left;
        height: 53px;
        line-height: 53px;
        font-size: 17px;
      }
    }
    .chart-item-wrapper {
      position: relative;
      background-color: #ffffff;
      margin-bottom: 20px;
      border-radius: 4px;
      .remark {
        height: 53px;
        padding: 0 20px;
        .item {
          display: inline-block;
          height: 100%;
          line-height: 53px;
          font-weight: bold;
          font-size: 15px;
        }
      }
      .chart-item {
        padding-left: 20px;
        padding-right: 20px;
      }
      .line-analysis {
        padding-left: 0;
        padding-right: 0;
      }
      .line-analysis,
      .bar-analysis {
        height: 350px;
      }
      .region-bar {
        height: 580px;
      }
      .region-analysis {
        height: 580px;
      }
      .no-data-tip {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%, -50%, 0);
        font-weight: bold;
        font-size: 20px;
      }
      .map-col {
        position: relative;
      }
      .backProvince {
        position: absolute;
        padding: 3px 12px;
        right: 50px;
        top: 10px;
        font-weight: bold;
        font-size: 24px;
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 2px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        transition: all 0.2s ease-in-out;
        color: #ffffff;
        cursor: pointer;
        &:hover {
          background-color: rgba(0, 0, 0, 0.7);
        }
      }
    }
  }
</style>


