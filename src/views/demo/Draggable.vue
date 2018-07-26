<template>
    <div class="fl-container">
        <draggable :index="index" v-on:get-data="getData"></draggable>
    </div>
</template>

<script>
    import draggable from '@/components/draggable/Draggable';
    const DraggableComponent = {
        components: {draggable},
        data() {
            return {
                index: null
            }
        },
        methods: {
            getData(data) {}
        },
        mounted() {
            let vm = this;
            vm.$set(vm, 'index', vm.$unique());
        }
    };
    export default DraggableComponent;
</script>
