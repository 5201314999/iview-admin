<template>
    <Submenu :name="items.name">
        <template slot="title">
            <icon :type="items.icon" v-if="items.icon"></icon>{{ items.title }}
        </template>
        <template v-for="item in items.children">
            <SlideMenuItem :items="item" :key="'menu-' + item.name" v-if="item.children && item.children.length > 0"></SlideMenuItem>
            <MenuItem :name="item.name" :key="'menu-' + item.name" v-else>
                <icon :type="item.icon" v-if="item.icon"></icon>
                <router-link :to="{path: item.path}">{{ item.title }}</router-link>
            </MenuItem>
        </template>
    </Submenu>
</template>

<script>

    export default {
        name: 'SlideMenuItem',
        props: {
            items: {
                type: Object,
                default: () => {}
            }
        }
    };

</script>