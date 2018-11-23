<template>

</template>
<script>
    import Vue from 'vue';
    import Sortable from 'sortablejs';
    import  {on, off} from 'iview/src/utils/dom';

    const bus = new Vue();
    const name = 'wi-component-row';

    const RecommendRowComponent = {};

    const DraggableComponent = {
        name: 'draggable',
        props: {
            config: {
                type: Object,
                default: () => {}
            }
        },
        data() {},
        methods: {},
        watch: {},
        mounted() {},
        destoryed() {}
    };
    export default DraggableComponent;
</script>
