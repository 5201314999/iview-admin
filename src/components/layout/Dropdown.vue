<template>
    <Dropdown placement="right-start">
        <Row class="wi-title-icon">
            <icon :type="items.icon" v-if="items.icon"></icon>
            <icon type="ios-link-outline" v-else></icon>
            <span class="wi-except-first-title ml10" v-html="items.title" v-if="items.title"></span>
        </Row>
        <a href="javascript:void(0);" class="wi-except-first-arrow">
            <icon type="ios-arrow-forward"></icon>
        </a>
        <template v-for="item in items.children">
            <DropdownMenu slot="list">
                <DropdownItem v-if="item.children && item.children.length > 0">
                    <DropdownMenuItem :items="item" :key="prefix + item.name"></DropdownMenuItem>
                </DropdownItem>
                <DropdownItem :class="setActive(item.path)" v-else-if="!G.regExps.url.test(item.path)">
                    <router-link :to="{path: item.path}">
                        <icon :type="item.icon" v-if="item.icon"></icon>
                        {{ item.title }}
                    </router-link>
                </DropdownItem>
                <DropdownItem v-else-if="G.regExps.url.test(item.path)">
                    <a :href="item.path" target="_blank">
                        <icon :type="item.icon" v-if="item.icon"></icon>
                        {{ item.title }}
                    </a>
                </DropdownItem>
            </DropdownMenu>
        </template>
    </Dropdown>
</template>
<script>
    const DropdownMenuItemComponent = {
        name: 'DropdownMenuItem',
        props: {
            items: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                prefix: 'menu-'
            };
        },
        methods: {
            setActive(path) {
                const vm = this;
                let full = vm.$route.fullPath;
                if(full !== '/' && full !== ''){
                    full = full.replace(path, '');
                    if(full === '/' || full === ''){
                        return 'wi-dropdown-menu-item-selected';
                    }
                }
            }
        }
    };
    export default DropdownMenuItemComponent;
</script>
