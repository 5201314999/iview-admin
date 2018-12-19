<template>
    <router-view></router-view>
</template>
<script>
    import {throttle} from 'throttle-debounce';
    export default {
        created() {
            const vm = this,
                sider = '.layout-sider';
            vm.$nextTick(() => {
                window.onresize = throttle(300, () => {
                    vm.$root.$emit('resize');
                });
                vm.$root.$on('resize', () => {
                    if(document.querySelector(sider)){
                        vm.$root.contentWidth = document.querySelector('body').offsetWidth - document.querySelector(sider).offsetWidth;
                    }
                });
            });
        }
    };
</script>
