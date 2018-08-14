<template>
    <div class="sider" :class="collapsedState">
        <div class="sider-children">
            <div class="sider-logo">
                <router-link :to="{path: '/'}" :title="G.title">
                    <img src="../../images/logo.png" :alt="G.title" />
                    <h1>{{ G.title }}</h1>
                </router-link>
            </div>
            <div class="sider-menu">
                <template v-if="!isCollapsed">
                    <Menu theme="dark" :width="width.unfold" :active-name="menu.active" :open-names="menu.open" @on-select="setMenuActive" ref="menu" accordion>
                        <template v-for="item in menu.items">
                            <SlideMenuItem :items="item" :key="'menu-' + item.name" v-if="item.children && item.children.length > 0"></SlideMenuItem>
                            <MenuItem :name="item.name" v-else>
                            <icon :type="item.icon" v-if="item.icon"></icon>
                            <router-link :to="{path: item.path}">
                                {{ item.title }}
                            </router-link>
                            </MenuItem>
                        </template>
                    </Menu>
                </template>
                <template v-if="isCollapsed">
                    <Menu theme="dark" :active-name="menu.active" :open-names="menu.open" :width="width.collapse">
                        <template v-for="item in menu.items">
                            <MenuItem :name="item.name">
                            <DropdownMenuItem :items="item" :key="'menu-' + item.name" v-if="item.children && item.children.length > 0"></DropdownMenuItem>
                            <router-link :to="{path: item.path}" v-else>
                                <icon :type="item.icon" v-if="item.icon"></icon>
                            </router-link>
                            </MenuItem>
                        </template>
                    </Menu>
                </template>
            </div>
        </div>
    </div>
</template>

<script>

    import SlideMenuItem from './SlideMenuItem';
    import DropdownMenuItem from './DropdownMenuItem';

    const SiderComponent = {
        components: {
            'SlideMenuItem': SlideMenuItem,
            'DropdownMenuItem': DropdownMenuItem
        },
        props: {
            collapse: {
                type: [Boolean, String],
                default: false
            }
        },
        computed: {
            isCollapsed: function () {
                return this.collapse;
            },
            collapsedState: function () {
                if (!this.collapse) this.setMenuActive();
                return this.collapse ? 'sider-collapsed' : '';
            }
        },
        data() {
            return {
                title: this.G.title,
                menu: {
                    items: this.G.menu.items,
                    active: this.G.menu.active || null,
                    open: []
                },
                names: [],
                nameObj: {},
                width: {
                    collapse: '80',
                    unfold: '256'
                }
            }
        },
        mounted() {
            const vm = this;
            vm.getUserInfo();

            vm.$on('get-user-success', function(data){
                vm.$set(vm.G, 'user', data);
                vm.$emit('username');
                const menu = data['listResource'];

                if(menu && menu.length > 0){
                    const menus = vm.parseMenu(menu);
                    vm.$set(vm.G.menu, 'items', menus);
                    vm.$set(vm.menu, 'items', menus);
                }
                vm.getMenuName(vm.menu.items);
                vm.setMenuActive();
            });
        },
        watch: {
            '$route': function (val) {
                const vm = this;
                if (vm.$route.path === '/' || vm.$route.path === '') {
                    vm.setMenuActiveDef();
                }
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            }
        },
        methods: {
            getMenuName(data, name, isChild) {
                const vm = this;
                if (isChild) vm.nameObj[name] = {};
                for (let i in data) {
                    if (data.hasOwnProperty(i)) {
                        let cur = data[i];
                        if (cur.name) {
                            vm.names.push(cur.name);
                            if (isChild) {
                                vm.nameObj[name][cur.name] = cur.name;
                            } else {
                                vm.nameObj[cur.name] = cur.name;
                            }
                            if (cur.children && cur.children.length > 0) {
                                vm.getMenuName(cur.children, cur.name, true);
                            }
                        }
                    }
                }
            },
            parseMenu(menu) {
                let flag = 0;
                const vm = this,
                    temp = [],
                    length = menu.length,
                    getChildren = function (data) {
                        const res = [], len = data.length;
                        let i = 0;
                        if (len > 0) {
                            for (; i < len; i++) {
                                let cur = data[i],
                                    children = cur['listChildren'],
                                    item = {
                                        title: cur['resname'],
                                        name: cur['resparam']
                                    };
                                if (children && children.length > 0) {
                                    item.children = getChildren(children);
                                } else {
                                    item.path = cur['resparam'];
                                    if (flag === 0) {
                                        vm.$set(vm.G.menu, 'active', item.path);
                                        vm.$set(vm.menu, 'active', item.path);
                                        flag++;
                                    }
                                }
                                res.push(item);
                            }
                        }
                        return res;
                    };
                for (let i = 0; i < length; i++) {
                    const cur = menu[i],
                        children = cur['listChildren'],
                        item = {
                            title: cur['resname'],
                            icon: cur['icon'],
                            name: vm.$unique(),
                            children: []
                        };
                    item.children = getChildren(children);
                    if (i === 0) {
                        vm.$set(vm.G.menu, 'open', [item.name]);
                        vm.$set(vm.menu, 'open', [item.name]);
                    }
                    temp.push(item);
                }
                return temp;
            },
            setMenuActive() {
                const vm = this, route = vm.$route, path = route.path;
                vm.$set(vm.menu, 'open', []);
                const targetName=vm.names.find(e=>{
                    return path.indexOf(e)!==-1
                });
                if (targetName) {
                    vm.$set(vm.menu, 'active', targetName);
                    for (let i in vm.nameObj) {
                        if (vm.nameObj.hasOwnProperty(i)) {
                             for(let j in vm.nameObj[i])
                                if(vm.nameObj[i].hasOwnProperty(j)&&path.indexOf(j)!==-1){
                                if (vm.inArray(i.toString(), vm.menu.open) === -1) {
                                    vm.menu.open.push(i.toString());
                                }
                            }
                        }
                    }
                }
                vm.updateMenuActive();
            },
            getRootName(path) {
                const vm = this,
                    paths = path.split('/');
                let name = '';
                if (paths.length > 1) {
                    for (let i in paths) {
                        if (paths.hasOwnProperty(i)) {
                            if (vm.inArray(paths[i], vm.names) !== -1) {
                                name = paths[i];
                            }
                        }
                    }
                }
                return name ? name : path;
            },
            setMenuActiveDef() {
                const vm = this;
                vm.$set(vm.menu, 'active', vm.G.menu.active);
                vm.$set(vm.menu, 'open', vm.G.menu.open);
                vm.updateMenuActive();
            },
            updateMenuActive() {
                const vm = this;
                vm.$nextTick(() => {
                    vm.$refs.menu.updateOpened();
                    vm.$refs.menu.updateActiveName();
                });
            }
        }
    };

    export default SiderComponent;

</script>
