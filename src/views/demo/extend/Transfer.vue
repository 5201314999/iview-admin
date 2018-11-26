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
					'<\/script>'
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
