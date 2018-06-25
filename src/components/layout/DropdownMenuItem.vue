<template>
    <Dropdown placement="right-start">
        <icon :type="items.icon" v-if="items.icon"></icon>
        <a href="javascript:void(0);" v-else>
            {{ items.title }}
            <icon type="ios-arrow-right"></icon>
        </a>
        <template v-for="item in items.children">
            <DropdownMenu slot="list">
                <DropdownItem v-if="item.children && item.children.length > 0">
                    <DropdownMenuItem :items="item" :key="'menu-' + item.name"></DropdownMenuItem>
                </DropdownItem>
                <DropdownItem :class="setActive(item.path)" v-else>
                    <router-link :to="{path: item.path}">
                        {{ item.title }}
                    </router-link>
                </DropdownItem>
            </DropdownMenu>
        </template>
    </Dropdown>
</template>

<script>
    export default {
        name: 'DropdownMenuItem',
        props: {
            items: {
                type: Object,
                default: () => {}
            }
        },
        methods: {
            setActive(name) {
                let path = this.$route.fullPath;
                if(path !== '/' && path !== ''){
                    path = path.replace(name, '');
                    if(path === '/' || path === ''){
                        return 'ivu-menu-item-selected'
                    }
                }
            }
        }
    }
</script>