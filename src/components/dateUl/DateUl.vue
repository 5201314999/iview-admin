<!--
Description
@authors fanjiongrong (fanjiongrong@tvflnet.com)
@date    2019-05-28 17:38:32
@version 1.0.0
-->
<template>
  <div class="date-ul">
    <div class="label">缩放：</div>
    <ul class="content">
      <li
        v-for="(item,index) in list"
        :key="index"
        :class="{active:index === activeIndex}" 
         @click.stop="selectBtn(index,item)"
      >
        {{item}}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'DataUl',
    model: {
      prop: 'value'
    },
    props: {
      list: {
        type: Array,
        default: () => {
          return ['1星期', '1个月', '半年', '全部']
        }
      },
      value: {
        type: [String, Number],
        default: ''
      }
    },
    data() {
      return {
        activeIndex: ''
      }
    },
    mounted() {
      if (this.value === '') {
        this.activeIndex = 0;
      }
      else {
        this.activeIndex = this.btnList.findIndex(e => {
          return this.value === e.value;
        });
      }
    },
    methods: {
      selectBtn(index, value) {
        this.activeIndex = index;
        this.$emit('input', value);
        this.$emit('on-change', value);
      },
    },
  }
</script>

<style lang="scss" scoped>
  $theme-color: #409eff;
  .date-ul {
    display: flex;
    font-size: 14px;
    .label {
      line-height: 30px;
      margin-right: 10px;
    }
    ul {
      display: flex;
      height: 30px;
      transition: 0.3s;
      li {
        list-style: none;
        background-color: #ffffff;
        margin-right: 10px;
        height: 100%;
        line-height: 36px;
        background-color: #e8e8e8;
        min-width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        padding: 0 5px;
        &:hover {
          cursor: pointer;
          color: $theme-color;
        }
        &.active {
          border: 1px solid $theme-color;
          border-right: none;
          color: #ffffff;
          background-color: $theme-color;
        }
      }
    }
  }
</style>
