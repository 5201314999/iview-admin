<template>
    <Row class="container root-container" :class="{'collapsed':G.menu.collapsed}">
        <spin size="large" fix v-if="loading"></spin>
        <wi-layout></wi-layout>
    </Row>
</template>
<script>
    import Layout from '@/components/layout/Layout';
    const HomeComponent = {
        components: {'wi-layout': Layout},
        data() {
            return {loading: true}
        },
        mounted() {
            const vm = this;
            vm.$set(vm, 'loading', false);
        }
    };
    export default HomeComponent;
</script>


