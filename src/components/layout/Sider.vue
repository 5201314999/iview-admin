<template>
    <Row class="layout-sider wi-custom-scroll" :class="clsCollapsed">
        <Row class="sider-list">
            <Row class="sider-logo">
                <router-link :to="{path: '/'}" :title="G.title">
                    <img :src="G.logo" :alt="G.title" v-if="G.logo" />
                    <icon type="ios-appstore-outline" v-if="!G.logo"></icon>
                    <h1 v-html="G.title"></h1>
                </router-link>
            </Row>
            <Row class="sider-menu">
                <!-- accordion -->
                <template v-if="!isCollapsed">
                    <Menu theme="dark" mode="vertical" :width="width.unfold" :active-name="menu.active" :open-names="menu.open" ref="menu" accordion>
                        <template v-for="item in menu.items">
                            <!-- submenu : if -->
                            <AccordionMenuItem :items="item" :key="prefix + item.name" v-if="item.children && item.children.length > 0"></AccordionMenuItem>
                            <!-- menuitem : else -->
                            <MenuItem :name="item.name" v-else>
                                <span class="wi-menu-icon" v-if="item.icon"><icon :type="item.icon"></icon></span>
                                <router-link :to="{path: item.path}" :class="item.icon ? '' : 'wi-menu-link'" v-html="item.title"></router-link>
                            </MenuItem>
                        </template>
                    </Menu>
                </template>
                <!-- dropdown -->
                <template v-if="isCollapsed">
                    <Menu theme="dark" mode="vertical" :width="width.fold" :active-name="menu.active" :open-names="menu.open" ref="menu">
                        <template v-for="item in menu.items">
                            <MenuItem :name="item.name">
                                <DropdownMenuItem :items="item" :key="prefix + item.name" v-if="item.children && item.children.length > 0"></DropdownMenuItem>
                                <router-link :to="{path: item.path}" v-else>
                                    <icon :type="item.icon" v-if="item.icon"></icon>
                                    <icon type="ios-link-outline" v-else></icon>
                                </router-link>
                            </MenuItem>
                        </template>
                    </Menu>
                </template>
            </Row>
        </Row>
    </Row>
</template>
<script>
    import AccordionMenu from '@/components/layout/Accordion';
    import DropdownMenu from '@/components/layout/Dropdown';
    const SiderComponent = {
        components: {
            'AccordionMenuItem': AccordionMenu,
            'DropdownMenuItem': DropdownMenu
        },
        props: {
            collapse: {
                type: [Boolean, String],
                default: false
            },
            update: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            isCollapsed: function() {
                const vm = this;
                return vm.collapse;
            },
            clsCollapsed: function() {
                const vm = this;
                return vm.collapse ? 'layout-sider-collapsed' : '';
            }
        },
        data() {
            const vm = this;
            return {
                prefix: 'menu-',
                title: vm.G.title,
                menu: {
                    items: vm.G.menu.items,
                    active: vm.G.menu.active || null,
                    open: []
                },
                width: {
                    fold: '80',
                    unfold: '256'
                }
            }
        },
        methods: {
            parseMenu(menu) {
                const vm = this,
                    temp = [],
                    length = menu.length,
                    getChildren = (data) => {
                        const res = [],
                            len = data.length;
                        for(let i = 0; i < len; i++){
                            const cur = data[i],
                                children = cur['listChildren'],
                                item = {
                                    title: cur['resname'],
                                    icon: cur['icon'],
                                    name: cur['resid']
                                };
                            if(children && children.length > 0){
                                item.children = getChildren(children);
                            }else{
                                item.path = cur['resparam'];
                                if(flag === 0){
                                    vm.$set(vm.G.menu, 'active', item.name);
                                    vm.$set(vm.menu, 'active', item.name);
                                    flag++;
                                }
                            }
                            res.push(item);
                        }
                        return res;
                    };
                let flag = 0;
                for(let i = 0; i < length; i++){
                    const cur = menu[i],
                        children = cur['listChildren'],
                        item = {
                            title: cur['resname'],
                            icon: cur.icon,
                            name: cur['resid'],
                            children: []
                        };
                    item.children = getChildren(children);
                    if(i === 0){
                        vm.$set(vm.G.menu, 'open', [item.name]);
                        vm.$set(vm.menu, 'open', [item.name]);
                    }
                    temp.push(item);
                }
                return temp;
            }
        },
        watch: {
            update: function() {
                const vm = this;
                vm.$nextTick(() => {
                    vm.$refs.menu.updateOpened();
                    vm.$refs.menu.updateActiveName();
                });
            }
        },
        mounted() {
            const vm = this;
            vm.getUser();
            vm.$on('get-user-success', (data) => {
                vm.$set(vm.G, 'user', data);
                vm.$emit('username');
                if(!vm.G.debug){
                    const menu = data['listResource'];
                    if(menu){
                        const menus = vm.parseMenu(menu);
                        vm.$set(vm.G.menu, 'items', menus);
                        vm.$set(vm.menu, 'items', menus);
                    }
                }
                vm.$nextTick(() => {
                    vm.$refs.menu.updateOpened();
                    vm.$refs.menu.updateActiveName();
                });
            });
        }
    };
    export default SiderComponent;
</script>
