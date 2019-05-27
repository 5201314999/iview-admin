<template>
  <div class="wrapper">
    <div class="color"></div>
    <div id="particles-js"></div>
    <div class="panel">
      <div class="form">
        <form action="menu.html">
          <div class="logo">
            <img
              :src="require('../../../static/images/img_logo.svg')"
              alt="vas"
            >
          </div>

          <div class="form-control">
            <i class="icon account"></i><input
              type="text"
              placeholder="请输入帐号"
            >
          </div>
          <div class="form-control">
            <i class="icon password"></i><input
              type="password"
              placeholder="请输入密码"
            >
          </div>

          <input
            type="submit"
            class="btn-submit"
            value="登录"
          >

          <div class="function">
            <div
              class="btn-group btn-group-vertical"
              data-toggle="buttons"
            >
              <label class="btn active">
                <input
                  type="checkbox"
                  name='email1'
                ><i class="icon-check-empty"></i><i class="icon-check"></i> <span>记住帐号</span>
              </label>
            </div>
            <a
              href="#"
              class="forgot-password"
            >忘记密码</a>
          </div>

        </form>

        <div class="copyright">
          <p>系统版本1.0 © 2018 富连网系统整合服务处</p>
          <p>若您有任何意见或建议，请与资讯人员联系：<span>567-60285</span></p>
          <p>本网站建议以Chrome丶360或Internet Explore以上等浏览器浏览</p>
        </div>

      </div><!-- .form -->

    </div><!-- .panel -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {}
    };
  },
  components: {}
};
</script>

<style src="../../../static/css/login.css" scoped></style>
<style scoped>
.wrapper {
  font-family: "Microsoft YaHei New", "Microsoft Yahei", "微软雅黑", "helvetica", "Arial", sans-serif;
  font-size: 16px;
  background: url(../../../static/images/bg.jpg) right bottom no-repeat;
  background-attachment: fixed;
  background-size: cover;
  height: 100%;
}
</style>

