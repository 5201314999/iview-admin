<template>
    <div class="layout-header">
        <div class="header">
            <icon type="android-menu" class="header-trigger" @click="collapsedMenu"></icon>
            <div class="header-nav right">
                <span class="nav-item"><icon type="android-person"></icon>{{ getUserName }}</span>
                <span class="nav-item" @click="logoutUser">
                    <icon type="power"></icon>退出登录
                </span>
            </div>
        </div>
    </div>
</template>

<script>

    const HeaderComponent = {
        methods: {
            collapsedMenu() {
                const vm = this;
                vm.G.menu.collapsed = !vm.G.menu.collapsed;
                vm.$emit('collapsed');
            },
            logoutUser() {
                const vm = this;
                vm.logout();
            }
        },
        props: {
            username: {
                type: String
            }
        },
        computed: {
            getUserName() {
                return this.username;
            }
        },
        mounted() {
            const vm = this;
            vm.setTitle();
        }
    };

    export default HeaderComponent;

</script>
