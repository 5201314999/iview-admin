<template>
    <Row class="layout-header">
        <Row class="header">
            <icon type="ios-menu-outline" class="header-trigger" @click=""></icon>
            <Row class="header-nav right">
                <Dropdown @on-click="signOut">
                    <a href="javascript:void(0);">
                        <img :src="G.user.icon" class="header-avatar" v-if="G.user && G.user.icon" /> {{ getUserName }}
                    </a>
                </Dropdown>
            </Row>
        </Row>
    </Row>
</template>
<script>
    const HeaderComponent = {
        props: {
            username: {type: String}
        },
        data() {
            return {
                menus: [],
                location: '',
                active: ''
            };
        },
        computed: {
            getUserName() {
                const vm = this;
                return vm.username;
            }
        },
        methods: {
            collapsed() {
                const vm = this;
                vm.G.menu.collapsed = !vm.G.menu.collapsed;
                vm.$emit('collapsed');
                vm.$root.$emit('resize');
            },
            signOut(name) {
                const vm = this;
                if(name === 'exit') vm.logout();
            }
        },
        created() {

        },
        mounted() {
            const vm = this;
            vm.setTitle();
        }
    };
    export default HeaderComponent;
</script>
