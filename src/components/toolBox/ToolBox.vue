<!--
Description
@authors fanjiongrong (fanjiongrong@tvflnet.com)
@date    2018-08-02 08:25:45
@version 1.0.0
-->
<template>
  <ul class="tool-box">
    <li ref="liList" v-for="(item,index) in btnList" :class="{active:item.value === value}" @click.stop="selectBtn(item.value)">{{item.label}}</li>
    <div class="bar-animated" :style="activeStyle"></div>
  </ul>
</template>

<script>
  export default {
    label: 'ToolBox',
    model: {
      prop: 'value',
    },
    props: {
      btnList: {
        type: Array,
        required: true
      },
      value: {
        type: [String, Number],
        default: ''
      }
    },
    data() {
      return {
        barWidth: 0,
        barOffset: 0
      }
    },
    computed: {
      activeStyle() {
        let style = {
          visibility: 'visible',
          width: `${this.barWidth}px`
        };
        style.transform = `translate3d(${this.barOffset}px, 0px, 0px)`;
        return style;
      }
    },
    mounted() {
      this.updateBar();
    },
    watch:{
      value(){
        this.updateBar();
      }
    },
    methods: {
      selectBtn(value) {
        this.$emit('input', value);
        this.$emit('on-change', value);
      },
      updateBar() {
        let activeIndex;
        for (let i = 0; i < this.btnList.length; i++) {
          if (this.btnList[i].value === this.value) {
            activeIndex = i;
            break;
          }
        }
        this.barWidth = this.$refs.liList[activeIndex].offsetWidth;
        this.barOffset = 0;
        for (let j = 0; j < activeIndex; j++) {
          this.barOffset += this.$refs.liList[j].offsetWidth;
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  .tool-box {
    float: right;
    position: relative;
    height:100%;
    li {
      display: inline-block;
      padding: 16px 16px 14px;
      height:100%;
      text-align: center;
      font-size: 14px;
      cursor: pointer;
      &:hover {
        color: #2d8cf0;
      }
    }
    .bar-animated {
      height: 2px;
      box-sizing: border-box;
      background-color: #2d8cf0;
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 1;
      transition: -webkit-transform 0.3s ease-in-out;
      transition: transform 0.3s ease-in-out;
      transition: transform 0.3s ease-in-out, -webkit-transform 0.3s ease-in-out;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
    }
  }
</style>
