<template>
  <div class="wrapper">
    <div class="color"></div>
    <div id="particles-js"></div>
    <div class="panel">
      <div class="form">
        <form action="menu.html">
          <div class="logo">
            <img
              :src="require('../../../static/images/logo.png')"
              alt="vas"
            >
            <div class="title">黄鹄科技策略量化平台</div>
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
          <p>系统版本1.0 © 2019</p>
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
  components: {},
  mounted() {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: 100,
          density: {
            enable: true,
            value_area: 500
          }
        },
        color: {
          value: ["#b1c900", "#EE7752", "#E73C7E", "#23A6D5", "#23D5AB"]
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000"
          },
          polygon: {
            nb_sides: 5
          },
          image: {
            width: 100,
            height: 100
          }
        },
        opacity: {
          value: 1,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.5,
            sync: false
          }
        },
        size: {
          value: 2,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.3,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 70,
          color: "#433F93",
          opacity: 0.4,
          width: 1
        }
      },
      retina_detect: true
    });
  }
};
</script>

<style src="../../../static/css/login.css" scoped></style>
<style lang="scss" scoped>
.wrapper {
  font-family: "Microsoft YaHei New", "Microsoft Yahei", "微软雅黑", "helvetica",
    "Arial", sans-serif;
  font-size: 16px;
  background: url(../../../static/images/bg.jpg) right bottom no-repeat;
  background-attachment: fixed;
  background-size: cover;
  height: 100%;
  min-height: 650px;
}
.panel {
  max-width: 500px;
}
.logo {
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & > img {
    max-width: 300px;
    width: auto;
  }
  .title {
    font-size: 38px;
    color: white;
    font-weight: 600;
  }
}
@media only screen and (max-width: 560px) {
  .logo .title {
    font-size: 32px;
  }
}
@media only screen and (max-width: 991px) {
  .wrapper {
    min-height: 800px;
  }
}
@media only screen and (min-width: 1000px) {
  .logo {
    padding-top: 80px;
  }
}
</style>

