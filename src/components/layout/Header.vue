<template>
    <div class="layout-header">
        <div class="header">
            <icon type="android-menu" class="header-trigger" @click="collapsedMenu"></icon>
            <div class="header-nav right">
                <span class="nav-item"><icon type="android-person"></icon>{{ G.user.name }}</span>
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
            this.getUserInfo();
            this.setTitle();
        },
        methods: {
            collapsedMenu() {
                this.G.menu.collapsed = !this.G.menu.collapsed;
                this.$emit('collapsed');
            },
            logoutUser() {
                this.logout();
            }
        }
    };

    export default HeaderComponent;

</script>