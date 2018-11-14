<template>
    <Row class="sider wi-custom-scroll">
        <Row class="sider-list">
            <Row class="sider-logo">
                <router-link :to="{path: '/'}" :title="G.title">
                    <img :src="G.logo" :alt="G.title" v-if="G.logo" />
                    <icon type="ios-appstore-outline" v-if="!G.logo"></icon>
                    <h1 v-html="G.title"></h1>
                </router-link>
            </Row>
            <Row class="sider-menu">
                <template>
                    <Menu theme="dark" mode="vertical" :width="width.unfold" :active-name="menu.active" :open-names="menu.open" @on-select="setMenuActive" ref="menu" accordion>
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
            setMenuActive() {

            },
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
                                    name: cur['resparam']
                                };
                            if(children && children.length > 0){
                                item.children = getChildren(children);
                            }else{
                                item.path = cur['resparam'];
                                if(flag === 0){
                                    vm.$set(vm.G.menu, 'active', item.path);
                                    vm.$set(vm.menu, 'active', item.path);
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
                            name: cur['resname'],
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
        mounted() {
            const vm = this;
            vm.getUser();
            vm.$on('get-user-success', (data) => {
                vm.$set(vm.G, 'user', data);
                if(!vm.G.debug){
                    const menu = data['listResource'];
                    if(menu){
                        const menus = vm.parseMenu(menu);
                        vm.$set(vm.G.menu, 'items', menus);
                        vm.$set(vm.menu, 'items', menus);
                    }
                }
            });
        }
    };
    export default SiderComponent;
</script>
