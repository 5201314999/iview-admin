<template>
    <Row class="layout-sider wi-custom-scroll" :class="clsCollapsed">
        <Row class="sider-list">
            <Row class="sider-logo">
                <router-link :to="{path: '/main'}" :title="project">
                    <img :src="logo" :alt="project" v-if="logo" />
                    <icon type="ios-appstore-outline" v-if="!logo"></icon>
                    <h1 v-html="project"></h1>
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
                                <router-link :to="{path: item.path}" :class="item.icon ? '' : 'wi-menu-link'" v-html="item.title" v-if="!G.regExps.url.test(item.path)"></router-link>
                                <a :href="item.path" target="_blank" v-html="item.title" v-if="G.regExps.url.test(item.path)"></a>
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
                                <router-link :to="{path: item.path}" v-else-if="!G.regExps.url.test(item.path)">
                                    <icon :type="item.icon" v-if="item.icon"></icon>
                                    <icon type="ios-link-outline" v-else></icon>
                                </router-link>
                                <a :href="item.path" target="_blank" v-html="item.title" v-else-if="G.regExps.url.test(item.path)"></a>
                            </MenuItem>
                        </template>
                    </Menu>
                </template>
            </Row>
        </Row>
    </Row>
</template>
<script>
    import {scrollTop} from 'iview/src/utils/assist';
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
            },
            project: {
                type: String,
                default: null
            },
            logo: {
                type: String,
                default: null
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
                path: null,
                title: vm.G.title,
                names: [],
                menus: [],
                menu: {
                    items: vm.G.menu.items,
                    active: vm.G.menu.active || null,
                    open: vm.G.menu.open||[]
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
                    opens=[],
                    getChildren = (data,firstLevelName) => {
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
                            res.push(item);
                            item.path = cur['resparam'];
                            const paths = item.path.replace('？', '?').split('?'), path = paths[0];
                            if(path && vm.path.indexOf(path) !== -1){
                                firstLevelName&&opens.push(firstLevelName);
                               children&&children.length > 0&&opens.push(item.name);
                            }
                            if(children && children.length > 0){
                                item.children = getChildren(children);
                            }else{
                                if(path && vm.path.indexOf(path) !== -1){
                                    vm.G.menu.active=item.name;
                                    vm.menu.active=item.name;
                                }
                            }
                        }
                        return res;
                    };
                for(let i = 0; i < length; i++){
                    const cur = menu[i],
                        children = cur['listChildren'],
                        item = {
                            title: cur['resname'],
                            icon: cur.icon,
                            name: cur['resid'],
                            children: []
                        };
                    if(children && children.length > 0){
                        item.children = getChildren(children,item.name);
                    }else{
                        delete item.children;
                        if(i === 0){
                            vm.$set(vm.G.menu, 'active', item.name);
                            vm.$set(vm.menu, 'active', item.name);
                        }
                        item.path = cur['resparam'];
                    }
                    temp.push(item);
                }
                vm.$set(vm.G.menu, 'open',opens);
                vm.$set(vm.menu, 'open', opens);
                return temp;
            },
            getMenuName() {
                const vm = this,
                    names = [],
                    getChildName = (children) => {
                        for(let k = 0; k < children.length; k++){
                            names.push(children[k].name);
                            if(children[k].children && children[k].children.length > 0){
                                getChildName(children[k].children);
                            }
                        }
                    };
                for(let i = 0; i < vm.menu.items.length; i++){
                    const item = vm.menu.items[i];
                    names.push(item.name);
                    if(item.children && item.children.length > 0){
                        getChildName(item.children);
                    }
                }
                vm.$set(vm, 'names', names);
            },
            updateMenuActive() {
                const vm = this;
                vm.$nextTick(() => {
                    vm.$refs.menu.updateOpened();
                    vm.$refs.menu.updateActiveName();
                });
            },
            setMenuActive() {
                const vm = this,paths = vm.$route.path.substr(1).split('/');
                const open=paths.slice(0,paths.length-1);
                const active=paths[paths.length-1];
                vm.$set(vm.menu, 'open', open);
                vm.$set(vm.menu,'active',active);
                // const contains = vm.inArray(active, vm.names) !== -1;
                // if(active && contains) vm.$set(vm.menu, 'active', active);
                // if(!contains) vm.$set(vm.menu, 'active', open);
            },
            backToTop() {
                const top = document.documentElement.scrollTop || document.body.scrollTop;
                scrollTop(window, top, 0, 1000);
            }
        },
        watch: {
            update: function() {
                const vm = this;
                vm.updateMenuActive();
            },
            '$route': function() {
                const vm = this;
                // if(!vm.G.debug){
                //     vm.$set(vm, 'path', vm.$route.path);
                //     vm.$set(vm.menu, 'open', []);
                //     vm.parseMenu(vm.menus);
                // }else vm.setMenuActive();
                vm.setMenuActive();
                vm.updateMenuActive();
                vm.backToTop();
            }
        },
        created() {
            const vm = this;
            vm.$set(vm, 'path', vm.$route.path);
            this.$nextTick(() => {
                this.$root.$emit('resize');
            });
        },
        mounted() {
            const vm = this;
            // vm.getUser();
            // if(vm.G.debug){
                vm.getMenuName();
                vm.setMenuActive();
                vm.updateMenuActive();
            // }else{
            //     vm.$on('get-user-success', (data) => {
            //         vm.$set(vm.G, 'user', data);
            //         vm.$emit('username');
            //         if(!vm.G.debug){
            //             const menu = data['listResource'];
            //             if(menu){
            //                 vm.$set(vm, 'menus', menu);
            //                 const menus = vm.parseMenu(menu);
            //                 vm.$set(vm.G.menu, 'items', menus);
            //                 vm.$set(vm.menu, 'items', menus);
            //             }
            //         }
            //         vm.updateMenuActive();
            //     });
            // }
        }
    };
    export default SiderComponent;
</script>
