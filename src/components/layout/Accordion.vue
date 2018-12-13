<template>
    <Submenu :name="items.name">
        <template slot="title">
            <span class="wi-menu-icon" v-if="items.icon"><icon :type="items.icon"></icon></span>
            {{ items.title }}
        </template>
        <template v-for="item in items.children">
            <!-- submenu : if -->
            <AccordionMenuItem :items="item" :key="prefix + item.name" v-if="item.children && item.children.length > 0"></AccordionMenuItem>
            <!-- menuitem : else -->
            <MenuItem :name="item.name" :key="prefix + item.name" v-else>
                <span class="wi-menu-icon" v-if="item.icon"><icon :type="item.icon"></icon></span>
                <router-link :to="{path: item.path}" :class="item.icon ? '' : 'wi-menu-link'" v-html="item.title" v-if="!G.regExps.url.test(item.path)"></router-link>
                <a :href="item.path" target="_blank" v-html="item.title" v-if="G.regExps.url.test(item.path)"></a>
            </MenuItem>
        </template>
    </Submenu>
</template>
<script>
    const AccordionMenuComponent = {
        name: 'AccordionMenuItem',
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
        }
    };
    export default AccordionMenuComponent;
</script>
