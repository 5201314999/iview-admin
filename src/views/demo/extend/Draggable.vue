<template>
	<Row class="layout-draggable">
		<Card>
			<Row slot="title" class="wi-card-title"><icon type="ios-create-outline" />
				Draggable
				<Select v-model="selection" :style="{width: '220px'}" @on-change="changeSelection" clearable>
					<Option value="1">添加常用模板 ( 新建 )</Option>
					<Option value="2">引用常用模板并初始化数据</Option>
					<Option value="3">可点击组件块的相关操作</Option>
				</Select>
			</Row>
			<!-- common -->
			<Row v-if="selection === '1'">
				<wi-draggable
					:rows="rows"
					:exec="exec"
					:init="true"
					:reset="reset"
					:reacquire="reacquire"
					v-on:layout-data="getLayoutData"
					:config="{
						title: false,
						template: {is: true}
					}">
				</wi-draggable>
				<Row class="wi-btn">
					<Button type="primary" size="large" @click="saveOrUpdate" class="mr15">保存 / 更新</Button>
				</Row>
			</Row>
			<!-- init -->
			<Row v-if="selection === '2'">
				<wi-draggable
						:rows="rows"
						:init="true"
						:filling="filling"
						:reset="reset"
						:reacquire="reacquire"
						v-on:layout-data="getLayoutData"
						:config="{
							title: true,
							template: {referenced: true}
						}">
				</wi-draggable>
				<Row class="wi-btn">
					<Button type="primary" size="large" @click="saveOrUpdate" class="mr15">保存 / 更新</Button>
				</Row>
			</Row>
			<!-- click -->
			<Row v-if="selection === '3'">
				<wi-draggable
					:rows="rows"
					:reacquire="reacquire"
					:init="true"
					:reset="reset"
					:filling="filling"
					:click="true"
					v-on:click-call="handleClickEvent"
					v-on:click-cancel="handleClickCancel"
					v-on:switch-tab="handleClickCancel"
					:increase="increase"
					:decrease="decrease"
					v-on:template-data="getTemplateData"
					v-on:layout-data="getLayoutData"
					:config="{
						assembled: false,
						template: {referenced: true}
					}">
				</wi-draggable>
				<Row class="wi-btn">
					<Button type="primary" size="large" @click="addSingle" class="mr15">内容回显（单个）</Button>
					<Button type="warning" size="large" @click="addMultiple" class="mr15">内容回显（多个）</Button>
					<Button type="error" size="large" @click="removeSingle" class="mr15">内容删除（单个）</Button>
					<Button type="primary" size="large" @click="removeMultiple">内容删除（多个）</Button>
				</Row>
			</Row>
			<!-- modal -->
			<Modal v-model="modal" class-name="wi-modal-custom" title="待提交数据格式" width="650">
				<pre class="padding20"><code v-html="components"></code></pre>
			</Modal>
		</Card>
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
		        selection: '1',
        	    rows: [],
		        exec: false,
		        reset: false,
		        filling: false,
		        increase: false,
		        decrease: false,
		        current: {},
		        reacquire: vm.$unique(),
		        components: {},
		        modal: false
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
		    handleClickCancel() {
        	    const vm = this;
        	    vm.$set(vm, 'current', {});
		    },
		    addSingle() {
        	    const vm = this,
		            url = vm.parseUrl(vm.G.api.draggable.content, {id: 602});
	            vm.$api.get(url, {}, (res) => {
	                if(res['ret']['retCode'].toString() === '0'){
	                    if(res.data.length > 0){
	                        const random = Math.floor(Math.random() * 12);
	                        let data = res.data[random],
		                        result = {
	                                id: vm.current.id,
			                        cid: data['recContentId'],
	                                poster: data['posterUrl'],
			                        cover: data['imageUrl'],
			                        type: data['recType']
		                        };
	                        vm.$set(vm, 'increase', result);
	                        vm.$set(vm, 'modal', true);
	                        vm.$set(vm, 'components', result);
	                    }
	                }else{
	                    vm.$error(res['ret']['retMsg']);
	                    return false;
	                }
	            }, (err) => {
	                vm.$error(err);
	                return false;
	            });
		    },
		    addMultiple() {
        	    const vm = this,
		            url = vm.parseUrl(vm.G.api.draggable.content, {id: 601});
	            vm.$api.get(url, {}, (res) => {
	                if(res['ret']['retCode'].toString() === '0'){
	                    if(res.data.length > 0){
	                        let datas = [], items = [];
	                        for(let i = 0; i < 2; i++){
	                            const random = Math.floor(Math.random() * 12);
	                            datas.push(res.data[random]);
	                        }
	                        datas.forEach((data) => {
	                            items.push({
		                            cid: data['recContentId'],
	                                poster: data['posterUrl'],
			                        cover: data['imageUrl'],
			                        type: data['recType']
	                            });
	                        });
	                        const result = {
	                            id: vm.current.id,
		                        list: items
	                        };
	                        vm.$set(vm, 'increase', result);
	                        vm.$set(vm, 'modal', true);
	                        vm.$set(vm, 'components', result);
	                    }
	                }else{
	                    vm.$error(res['ret']['retMsg']);
	                    return false;
	                }
	            }, (err) => {
	                vm.$error(err);
	                return false;
	            });
		    },
		    removeSingle() {
        	    const vm = this,
		            url = vm.parseUrl(vm.G.api.draggable.content, {id: vm.id});
	            vm.$api.get(url, {}, (res) => {
	                if(res['ret']['retCode'].toString() === '0'){
	                    if(res.data.length > 0){
	                        const random = Math.floor(Math.random() * 12);
	                        let data = res.data[random],
		                        result = [data['recContentId']];
	                        vm.$set(vm, 'decrease', result);
	                    }
	                }else{
	                    vm.$error(res['ret']['retMsg']);
	                    return false;
	                }
	            }, (err) => {
	                vm.$error(err);
	                return false;
	            });
		    },
		    removeMultiple() {
        	    const vm = this,
		            url = vm.parseUrl(vm.G.api.draggable.content, {id: vm.id});
	            vm.$api.get(url, {}, (res) => {
	                if(res['ret']['retCode'].toString() === '0'){
	                    if(res.data.length > 0){
	                        let datas = [], result = [];
	                        for(let i = 0; i < 2; i++){
	                            const random = Math.floor(Math.random() * 12);
	                            datas.push(res.data[random]);
	                        }
	                        datas.forEach((data) => {
	                            result.push(data['recContentId']);
	                        });
	                        vm.$set(vm, 'decrease', result);
	                    }
	                }else{
	                    vm.$error(res['ret']['retMsg']);
	                    return false;
	                }
	            }, (err) => {
	                vm.$error(err);
	                return false;
	            });
		    },
		    saveOrUpdate() {
        	    const vm = this;
        	    vm.$set(vm, 'reacquire', vm.$unique());
        	    vm.$set(vm, 'modal', true);
		    },
		    changeSelection(value) {
        	    const vm = this;
        	    value = parseInt(value);
        	    switch(value){
		            case 1:
		                vm.$set(vm, 'reset', vm.$unique());
		                vm.getTemplate();
		                break;
		            case 2:
		            case 3:
		                vm.$set(vm, 'reset', vm.$unique());
		                vm.getLayout();
		                break;
	            }
		    }
	    },
	    mounted() {
        	const vm = this;
        	vm.getTemplate();
	    }
    };
    export default DraggableDemoComponent;
</script>
