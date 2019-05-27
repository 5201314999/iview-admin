<template>
    <Row class="layout-header">
        <Row class="header clearfix">
            <icon type="ios-menu" class="header-trigger left" @click="collapsedMenu"></icon>
            <Row class="header-nav right">
                <Dropdown @on-click="signOut">
                    <a href="javascript:void(0);" v-if="!G.debug">
                        <img :src="G.user.icon" class="header-avatar mr10" v-if="G.user && G.user.icon" />
                        {{ getUserName }}
                    </a>
                    <a href="javascript:void(0);" v-if="G.debug">
                        <img src="static/images/avatar.jpg" class="header-avatar mr10" />
                        未知 ( DEBUG )
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem name="setting" disabled>
                            <icon type="ios-settings-outline"></icon>设置
                        </DropdownItem>
                        <DropdownItem name="exit">
                            <icon type="ios-power-outline"></icon>退出
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Row>
            <Row class="header-tabs right">
                <Menu ref="menus" mode="horizontal" theme="light" :active-name="active">
                    <MenuItem v-for="(item, key) in menus" :key="key" :name="item['programname']" :class="{'ivu-menu-item-active': item.url && item.url.length && location.indexOf(item.url) !== -1}" @click.native="navigate(item)" v-html="item['programname']"></MenuItem>
                </Menu>
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
                active: '',
                selector: 'ivu-menu-item-active'
            };
        },
        computed: {
            getUserName() {
                const vm = this;
                return vm.username;
            }
        },
        methods: {
            collapsedMenu() {
                const vm = this;
                vm.$set(vm.G.menu, 'collapsed', !vm.G.menu.collapsed);
                vm.setCookie(vm.G.cookie.collapse.name, vm.G.menu.collapsed, vm.G.cookie.collapse.expire);
                vm.$emit('collapsed');
                setTimeout(()=>{
                    vm.$root.$emit('resize');
                }, 300);
            },
            signOut(name) {
                const vm = this;
                if(name === 'exit') vm.logout();
            },
            navigate(data) {
                const vm = this;
                vm.$set(vm, 'active', '');
                setTimeout(() => {
                    const items = vm.$refs.menus.$el.querySelectorAll('.' + vm.selector);
                    vm.$nextTick(() => {
                        items.forEach((item) => {
                            item.classList.remove(vm.selector);
                        });
                    });
                    vm.menus.map((item) => {
                        if(item.url && item.url.length > 0 && vm.location.indexOf(item.url) !== -1){
                            vm.$set(vm, 'active', item['programname']);
                        }
                    });
                    if(data.url && data.url.length > 0){
                        window.location.href = data.url + '?'
                            + vm.G.id.mapping.pro + '=' + vm.G.id.pro + '&'
                            + vm.G.id.mapping.soa + '=' + vm.G.id.soa;
                    }
                }, 100);
            }
        },
        created() {
            // const vm = this;
            // vm.$api.get(vm.G.api.project, {
            //     method: 'getProLink',
            //     proId: vm.G.id.pro
            // }, (res) => {
            //     if(res['ret']['retCode'].toString() === '0'){
            //         const data = res.data;
            //         if(data){
            //             vm.$set(vm, 'menus', data.menu);
            //             if(data['program']){
            //                 const name = data['program']['programname'],
            //                     logo = data['program'].icon;
            //                 vm.$set(vm.G, 'title', name ? name : '');
            //                 vm.$set(vm.G, 'logo', logo);
            //                 vm.$emit('update-logo');
            //                 vm.setTitle();
            //             }
            //         }
            //     }else vm.setTitle();
            // }, () => {
            //     vm.setTitle();
            // });
        }
    };
    export default HeaderComponent;
</script>
