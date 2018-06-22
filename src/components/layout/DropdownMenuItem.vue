<template>
    <Dropdown placement="right-start">
        <icon :type="items.icon" v-if="items.icon"></icon>
        <template v-for="item in items.children">
            <DropdownMenuItem :items="item" :key="'menu-' + item.name" v-if="item.children && item.children.length > 0"></DropdownMenuItem>
            <DropdownMenu slot="list" v-else>
                <DropdownItem :class="setActive(item.path)">
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
                path = path.replace(name, '');
                if(path === '/' || path === ''){
                    return 'ivu-menu-item-selected'
                }
            }
        }
    }
</script>