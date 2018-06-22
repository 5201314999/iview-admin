<template>
    <div class="sider" :class="collapsedState">
        <div class="sider-children">
            <div class="sider-logo">
                <router-link :to="{path: '/'}" :title="G.title">
                    <img src="../../images/logo.png" :alt="G.title" />
                    <h1>{{ G.title }}</h1>
                </router-link>
            </div>
            <div class="sider-menu" ref="menu">
                <template v-if="!isCollapsed">
                    <Menu theme="dark" :active-name="menu.active" :open-names="menu.open" :width="width.unfold">
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
                width: {
                    collapse: '80',
                    unfold: '256'
                }
            }
        }
    };

    export default SiderComponent;

</script>