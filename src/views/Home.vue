<template>
    <div class="container">
        <spin size="large" fix v-if="loading"></spin>
        <fl-layout v-if="!loading"></fl-layout>
    </div>
</template>

<script>
    import Layout from '../components/layout/Layout';

    const HomeComponent = {
        data() {
            return {
                loading: true
            }
        },
        components: {
            'fl-layout': Layout
        },
        mounted() {
            this.loading = false;
        }
    };

    export default HomeComponent;

</script>

