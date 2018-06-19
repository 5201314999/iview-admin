<template>
    <div></div>
</template>

<script>

    const HomeComponent = {
        mounted() {
            this.$api.get('user/1');
        }
    };

    export default HomeComponent;

</script>

