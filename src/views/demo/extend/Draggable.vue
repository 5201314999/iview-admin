<template>
	<Row>
		<Row class="layout-draggable">
			<Card>
				<Row slot="title" class="wi-card-title"><icon type="ios-create-outline" /> Draggable</Row>
				<wi-draggable
						:rows="rows"
						:exec="exec"
						:reacquire="reacquire"
						:init="true"
						:filling="filling"
						:click="true"
						v-on:click-call="handleClickEvent"
						:increase="increase"
						:decrease="decrease"
						v-on:template-data="getTemplateData"
						v-on:layout-data="getLayoutData"
						:config="{
							title: true
						}">
				</wi-draggable>
			</Card>
		</Row>
		<Row class="wi-btn">
			<Button type="primary" size="large" @click="save">保存</Button>
		</Row>
	</Row>
</template>
<script>
    import Draggable from '@/components/draggable/Draggable';
    const DraggableDemoComponent = {
        components: {'wi-draggable': Draggable},
	    data() {
            const vm = this;
        	return {
        	    id: 288,
        		rows: [],
		        exec: false,
		        filling: false,
		        increase: false,
		        decrease: false,
		        current: {},
		        reacquire: vm.$unique(),
		        components: {}
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
	        },
		    getLayout() {
        	    const vm = this,
		            url = vm.parseUrl(vm.G.api.draggable.layout, {id: vm.id}),
		            link = vm.parseUrl(vm.G.api.draggable.content, {id: vm.id});
        	    vm.$api.get(url, {}, (res) => {
        	        if(res['ret']['retCode'].toString() === '0'){
        	            vm.$api.get(link, {}, (response) => {
        	                if(response['ret']['retCode'].toString() === '0'){
        	                    vm.$set(vm, 'rows', {
        	                        layout: res.data,
		                            content: response.data
	                            });
        	                    vm.$nextTick(() => {
        	                        vm.$set(vm, 'filling', vm.$unique());
	                            })
	                        }else{
        	                    vm.$error(response['ret']['retMsg']);
        	                    return false;
	                        }
	                    }, (error) => {
        	                vm.$error(error);
        	                return false;
	                    });
	                }else{
        	            vm.$error(res['ret']['retMsg']);
        	            return false;
	                }
	            }, (err) => {
        	        vm.$error(err);
        	        return false;
	            });
		    },
		    getTemplateData(data) {
        	    const vm = this;
        	    vm.$set(vm, 'rows', data);
        	    vm.$set(vm, 'exec', vm.$unique());
		    },
		    getLayoutData(data) {
        	    const vm = this;
        	    vm.$set(vm, 'components', data);
		    },
		    handleClickEvent(data) {
        	    const vm = this;
        	    vm.$set(vm, 'current', data);
		    },
		    save() {
	            const vm = this,
		            url = vm.parseUrl(vm.G.api.draggable.content, {id: vm.id});
	            vm.$api.get(url, {}, (res) => {
	                if(res['ret']['retCode'].toString() === '0'){
	                    if(res.data.length > 0){
	                        let data = res.data[0],
		                        result = {
	                                id: vm.current.id,
			                        cid: data['recContentId'],
	                                poster: data['posterUrl'],
			                        cover: data['imageUrl'],
			                        type: data['recType']
		                        };
	                        vm.$set(vm, 'increase', result);
	                    }
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
        	//vm.getTemplate();
        	vm.getLayout();
	    }
    };
    export default DraggableDemoComponent;
</script>
