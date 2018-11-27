<template>
	<Row class="layout-draggable">
		<Card>
			<Row slot="title" class="wi-card-title">
				<icon type="ios-create-outline" /> Draggable
			</Row>
			<wi-draggable :rows="rows" :exec="exec" :init="true"></wi-draggable>
		</Card>
	</Row>
</template>
<script>
    import Draggable from '@/components/draggable/Draggable';
    const DraggableDemoComponent = {
        components: {'wi-draggable': Draggable},
	    data() {
        	return {
        		rows: [],
		        exec: false
	        };
	    },
	    methods: {
        	getTemplate() {
        		const vm = this;
        		vm.$api.get(vm.parseUrl(vm.G.api.draggable.template, {id: 41}), {}, (res) => {
        			if(res['ret']['retCode'].toString() === '0'){
        				vm.$set(vm, 'rows', res.data['layoutRows']);
        				vm.$nextTick(() => {
        					vm.$set(vm, 'exec', vm.$unique());
				        });
			        }else{
        				vm.$error(res['ret']['retMsg']);
                        return false;
			        }
		        }, (err) => {
        			vm.$error(err);
                    return false;
		        });
	        }
	    },
	    mounted() {
        	const vm = this;
        	vm.getTemplate();
	    }
    };
    export default DraggableDemoComponent;
</script>
