<template>
	<Row class="layout-transfer">
		<Card>
			<Row slot="title" class="wi-card-title">
				<icon type="ios-create-outline" />
				<a href="https://www.iviewui.com/components/transfer" target="_blank">Transfer</a>
			</Row>
			<wi-trasnsfer v-model="tree.selected" :config="{
                dataOptions: [
                    {name: '芯片', value: '1704101'},
                    {name: 'Launcher', value: '1704102'},
                    {name: '内容', value: '1704103'},
                ],
                server: G.api.dimension
            }" @change="change" ref="tree"></wi-trasnsfer>
		</Card>
		<Card class="mt20">
			<Row slot="title" class="wi-card-title">
				<icon type="ios-code-working" /> 代码
			</Row>
			<pre v-highlight><code>{{ html }}</code></pre>
		</Card>
	</Row>
</template>
<script>
	import TransferSelect from '@/components/transfer/Transfer';
	const TransferDemoComponent = {
		components: {'wi-trasnsfer': TransferSelect},
		data() {
			return {
				tree: {
					selected: [],
					data: '',
					type: ''
				},
				html: '<template>\n' +
					'   <wi-trasnsfer v-model="tree.selected" :config="{\n' +
					'        dataOptions: [\n' +
					'            {name: \'芯片\', value: \'1704101\'},\n' +
					'            {name: \'Launcher\', value: \'1704102\'},\n' +
					'            {name: \'内容\', value: \'1704103\'},\n' +
					'        ],\n' +
					'        server: G.api.dimension\n' +
					'    }" @change="change" ref="tree"></wi-trasnsfer>\n' +
					'<\/template>' +
					'<script>\n' +
					'   import TransferSelect from \'@/components/transfer/Transfer\';\n' +
					'   const TransferDemoComponent = {\n' +
					'       components: {\'wi-trasnsfer\': TransferSelect},\n' +
					'       data() {\n' +
					'           return {\n' +
					'               tree: {\n' +
					'                   selected: [],\n' +
					'                   data: \'\',\n' +
					'                   type: \'\'\n' +
					'               }\n' +
					'           };\n' +
					'       },\n' +
					'       methods: {\n' +
					'           change(data) {\n' +
					'               const vm = this;\n' +
					'               vm.$set(vm.tree, \'type\', data.type);\n' +
					'               vm.$set(vm.tree, \'data\', data.data);\n' +
					'               vm.$set(vm.tree, \'selected\', vm.$refs.tree.getSelected());\n' +
					'           }\n' +
					'       },\n' +
					'       mounted() {\n' +
					'           const vm = this;\n' +
					'           vm.$nextTick(() => {\n' +
					'               vm.$refs.tree.init();\n' +
					'           });\n' +
					'       }\n' +
					'   };\n' +
					'   export default TransferDemoComponent;\n' +
					'<\/script>\n'

					+
					
					'\n使用方法：\n'+
					'1. \'import\' 引入插件并声明；\n'+
					'2. config可配置参数说明：\n'+
					    '	[expandTo] 树状结构展开到第几层 (Number)\n'+
					    '	[server] api请求地址 (String)\n'+
					    '	[readonly] 是否只读 (Boolean)\n'+
					    '	[title] 展示标题文字 (String)\n'+
					    '	[onlyLeaf] 是否 (Boolean)\n'+
					    '	[dataOptions] 可切换数据源，配置后显示右上角切换数据源下拉框(Array)，格式：\n'+
					                      '		[{name: "芯片", value: "1704101"},\n'+
										'		{name: "Launcher", value: "1704102"},\n'+
										'		{name: "内容", value: "1704103"}]\n'+
					    '	[dataType] dataOptions配置下拉框选中值\n'+
						'	[secondSelect] 是否二次选择(Boolean)\n'+
					'3. events\n'+
						'	[change] 选择项改变时，自动触发，传出已选择结果\n'+
					'4. 初始化组件方式\n'+
						'	4.1 通过 :data,传入数据，进行初始化,数据结构：\n'+
						'	{\n'+
							'		"maxLevel": 3,\n'+
							'		"datas": [{\n'+
								'			"id": "1",\n'+
								'			"name": "INFOCUS",\n'+
								'			"parentId": null,\n'+
								'			"level": 1\n'+
								'			}, {\n'+
								'			"id": "1-1",\n'+
								'			"name": "MStar638",\n'+
								'			"parentId": "1",\n'+
								'			"level": 2\n'+
								'			}, {\n'+
								'			"id": "1-1-194",\n'+
								'			"name": "测试2",\n'+
								'			"parentId": "1-1",\n'+
								'			"level": 3\n'+
							'		}]\n'+
						'	}\n'+
						'	4.1 通过调用init方法初始化，需要配置server,可选配置dataType，组件内部默认使用get方法请求\n'+
						'	4.2 通过调用initWithSelected方法初始化，传入参数格式如下，其中type按需要传入：\n'+
						'	{\n'+
							'		type: "1702002",\n'+
							'		data: ["1-4-43", "1-5-49", "2-4-41", "2-4-42"]\n'+
						'	}'
			};
		},
		methods: {
			change(data) {
				const vm = this;
				vm.$set(vm.tree, 'type', data.type);
				vm.$set(vm.tree, 'data', data.data);
				vm.$set(vm.tree, 'selected', vm.$refs.tree.getSelected());
			}
		},
		mounted() {
			const vm = this;
			vm.$nextTick(() => {
				vm.$refs.tree.init();
			});
		}
	};
    export default TransferDemoComponent;
</script>
