<template>
    <div class="layout-header">
        <div class="header">
            <icon type="android-menu" class="header-trigger" @click="collapsedMenu"></icon>
            <div class="header-nav right">
                <Dropdown @on-click="logoutUser">
                    <a href="javascript:void(0);">
                        <img src="@/images/user.png" class="header-avatar" /> {{ getUserName }}
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem name="setting" disabled>
                            <icon type="ios-gear-outline"></icon>设置
                        </DropdownItem>
                        <DropdownItem name="exit">
                            <icon type="ios-minus-outline"></icon>退出
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
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
            logoutUser(name) {
                const vm = this;
                if(name === 'exit') vm.logout();
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
