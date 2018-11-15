<template>
    <Row class="layout-content">
        <Content><router-view></router-view></Content>
    </Row>
</template>
<script>
    const ContentComponent = {
        data() {
            return {
                breadcrumb: []
            }
        },
        methods: {
            getBreadcrumb() {
                const vm = this;
            }
        },
        mounted() {
            const vm = this;
            vm.getBreadcrumb();
        }
    };
    export default ContentComponent;
</script>
