<template>
    <div class="layout-header">
        <div class="header">
            <icon type="android-menu" class="header-trigger" @click="collapsedMenu"></icon>
            <div class="header-nav right">
                <span class="nav-item"><icon type="android-person"></icon>{{ name }}</span>
                <span class="nav-item" @click="logoutUser">
                    <icon type="power"></icon>退出登录
                </span>
            </div>
        </div>
    </div>
</template>

<script>

    const HeaderComponent = {
        mounted() {
            let vm = this;
            vm.setTitle();
            vm.getUserInfo();
            vm.$on('get-user-success', function(){
                this.$set(vm, 'name', vm.G.user.name);
            })
        },
        methods: {
            collapsedMenu() {
                let vm = this;
                vm.G.menu.collapsed = !vm.G.menu.collapsed;
                vm.$emit('collapsed');
            },
            logoutUser() {
                this.logout();
            }
        },
        data() {
            return {name: ''}
        }
    };

    export default HeaderComponent;

</script>
