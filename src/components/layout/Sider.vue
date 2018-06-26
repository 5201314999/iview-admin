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
                    <Menu theme="dark" :active-name="menu.active" :open-names="menu.open" :width="width.unfold" @on-select="getMenuActive" @on-open-change="setMenuName" ref="menu">
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
            isCollapsed: function(){
                return this.collapse;
            },
            collapsedState: function(){
                return this.collapse ? 'sider-collapsed' : '';
            }
        },
        data() {
            return {
                title: this.G.title,
                menu: {
                    items: this.G.menu.items,
                    active: this.G.menu.active,
                    open: this.G.menu.open
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
            this.getMenuName(this.menu.items);
            this.setMenuName([]);
            this.getMenuActive();
        },
        watch: {
            $route: function(){
                if(this.$route.path === '/' || this.$route.path === ''){
                    this.setMenuActiveDef();
                }
            }
        },
        methods: {
            getMenuName(data, name, isChild) {
                let that = this;
                if(isChild) this.nameObj[name] = {};
                for(let i in data){
                    if(data.hasOwnProperty(i)){
                        let cur = data[i];
                        if(cur.name){
                            that.names.push(cur.name);
                            if(isChild){
                                this.nameObj[name][cur.name] = cur.name;
                            }else{
                                this.nameObj[cur.name] = cur.name;
                            }
                            if(cur.children && cur.children.length > 0){
                                that.getMenuName(cur.children, cur.name, true);
                            }
                        }
                    }
                }
            },
            getMenuActive() {
                let route = this.$route,
                    path = route.path.substring(1);
                if(path !== ''){
                    path = path.replace(/\//, '-');
                    if(this.inArray(path, this.names) !== -1){
                        this.$set(this.menu, 'active', path);
                        for(let i in this.nameObj){
                            if(this.nameObj.hasOwnProperty(i)){
                                if(this.nameObj[i][path]){
                                    if(this.inArray(i, this.menu.open) === -1){
                                        this.menu.open.push(i);
                                    }
                                }
                            }
                        }
                        console.log(this.menu);
                    }
                    this.updateMenuActive();
                }
            },
            setMenuActiveDef() {
                this.$set(this.menu, 'active', this.G.menu.active);
                this.$set(this.menu, 'open', this.G.menu.open);
                this.updateMenuActive();
            },
            setMenuName(name) {
                this.$set(this.menu, 'open', name);
            },
            updateMenuActive() {
                this.$nextTick(() => {
                    this.$refs.menu.updateOpened();
                    this.$refs.menu.updateActiveName();
                });
            }
        }
    };

    export default SiderComponent;

</script>