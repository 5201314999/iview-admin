<!--
Description
@authors fanjiongrong (fanjiongrong@tvflnet.com)
@date    2019-05-27 14:34:14
@version 1.0.0
-->
<template>
  <div class="tip-wrapper">
      <h1>~页面正在开发</h1>
      <div class="group">
        <h2 class="sub-title">别担心上车，我带你回去</h2>
        <Button type="primary">返回首页</Button>
      </div>
      <img src="../assert/images/todo.png">
  </div>
</template>

<script>
  export default {
  }
</script>

<style lang="scss" scoped>
    .tip-wrapper{
        min-height:400px;
        text-align: center;
        color:#1B8EE4;
        .group{
            margin-top:40px;
            display: flex;
            justify-content: center;
            align-items: center;
            .sub-title{
                margin-right:16px;
            }
        }
        img{
            margin-top:40px;
        }
    }
</style>
