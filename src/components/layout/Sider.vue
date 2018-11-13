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

            }
        },
        mounted() {
            const vm = this,
                soa = parseInt(vm.getUrl(vm.G.id.mapping.soa));
            if(soa && !isNaN(soa)) vm.$set(vm.G.id, 'soa', soa);
            vm.getUser();
            vm.$on('get-user-success', (data) => {
                vm.$set(vm.G, 'user', data);
                vm.$emit('username');
            });
        }
    };
    export default SiderComponent;
</script>
