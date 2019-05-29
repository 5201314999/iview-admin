<template>
  <router-view></router-view>
</template>
<script>
import { throttle } from "throttle-debounce";
export default {
  created() {
    const vm = this,
      sider = ".layout-sider";
    vm.$nextTick(() => {
      window.onresize = throttle(300, () => {
        vm.$root.$emit("resize", "native-resize");
      });
      vm.$root.$on("resize", flag => {
        if (document.querySelector(sider)) {
          let bodyWidth = document.querySelector("body").offsetWidth;
          let siderWidth = document.querySelector(sider).offsetWidth;
          vm.$root.contentWidth = bodyWidth - siderWidth;
          if (flag === "native-resize") {
            if (window.innerWidth < 1133 && !this.G.menu.collapsed) {
              this.$root.header.collapsedMenu();
            } else if (window.innerWidth > 1600 && this.G.menu.collapsed) {
              this.$root.header.collapsedMenu();
            }
          }
        }
      });
    });
  }
};
</script>
