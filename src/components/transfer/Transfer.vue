<template>
	<!-- 支持二次选择 -->
	<Row class="wi-transfer">
		<Row class="wrapper">
			<Row class="ivu-transfer">
				<!-- 左侧 -->
				<Row class="ivu-transfer-list" ref="left-wrapper" v-show="!readonly && !(config && config.secondSelect)">
					<Row class="ivu-transfer-list-header">
						<span class="ivu-transfer-list-header-title">
							<Checkbox v-show="!searchLeftFlag"
									v-model="checkAll_left"
									@on-change="toggleAll($event, 'dataLeft', 'checkedLeft', $refs.leftList, 'checkAll_left')"
									:disabled="dataLeft.length === 0">未选
							</Checkbox>
							<Checkbox v-show="searchLeftFlag"
									v-model="checkAll_left_match"
									@on-change="toggleAll($event, 'dataLeft_match', 'checkedLeft_match', $refs.leftList_match, 'checkAll_left_match')"
									:disabled="dataLeft_match.length === 0">未选
							</Checkbox>
						</span>
					</Row>
					<Row class="filter" v-if="dataOptions && dataOptions.length">
						<Select class="sourceSelector" v-model="data_type" size="small" style="width:100px" @on-change="dataTypeChange">
							<Option v-for="(item,index) in dataOptions" :value="item.value" :key="index">{{ item.name }}</Option>
						</Select>
					</Row>
					<Row class="search-wrapper">
						<Input ref="searchLeft" v-model="keyword_left" icon="ios-search" size="small" @on-change="searchChange($event, dataLeft, 'dataLeft_match')" clearable></Input>
					</Row>
					<Row class="ivu-transfer-list-body">
						<Tree ref="leftList"
						      v-show="!searchLeftFlag"
						      :data="dataLeft" show-checkbox
						      class="ivu-transfer-list-content wi-custom-scroll treeNode"
						      @on-check-change="checkChange('checkedLeft', $refs.leftList, 'checkAll_left')">
						</Tree>
						<Tree ref="leftList_match"
								v-show="searchLeftFlag"
								:data="dataLeft_match"
								show-checkbox class="ivu-transfer-list-content wi-custom-scroll treeNode"
								@on-check-change="checkChange('checkedLeft_match', $refs.leftList_match, 'checkAll_left_match')">
						</Tree>
					</Row>
				</Row>
				<!-- 中间 -->
				<Row class="ivu-transfer-operation" v-show="!readonly && !(config && config.secondSelect)">
					<Button size="small" type="primary" :disabled="disableAdd()" @click="add">添加</Button>
					<Button size="small" :disabled="disableRemove()" @click="remove">删除</Button>
				</Row>
				<!-- 右侧 -->
				<Row class="ivu-transfer-list" ref="right-wrapper">
					<Row class="ivu-transfer-list-header">
						<span class="ivu-transfer-list-header-title" v-show="!readonly">
							<Checkbox v-show="!searchRightFlag"
									v-model="checkAll_right"
									@on-change="toggleAll($event,'dataRight', 'checkedRight', $refs.rightList, 'checkAll_right')"
									:disabled="dataRight.length === 0">
								{{config && config.secondSelect ? '未选' : '已选'}}
							</Checkbox>
							<Checkbox v-show="searchRightFlag"
									v-model="checkAll_right_match"
									@on-change="toggleAll($event, 'dataRight_match', 'checkedRight_match', $refs.rightList_match, 'checkAll_left_match')"
									:disabled="dataRight_match.length === 0">
								{{config && config.secondSelect ? '未选' : '已选'}}
							</Checkbox>
						</span>
						<span class="ivu-transfer-list-header-count" v-show="!readonly && !(config && config.secondSelect)">
							<span class="selected_count">已选</span>{{selected.length}}
						</span>
						<div class="ivu-transfer-list-header-title" v-show="readonly" style="min-height:18px;text-align:center;">{{ title }}</div>
					</Row>
					<Row class="search-wrapper">
						<Input ref="searchRight" v-model="keyword_right" icon="ios-search" size="small" @on-change="searchChange($event,dataRight,'dataRight_match')" clearable></Input>
					</Row>
					<Row class="ivu-transfer-list-body">
						<Tree ref="rightList"
								v-show="!searchRightFlag"
								:data="dataRight"
								:show-checkbox="!readonly"
								class="ivu-transfer-list-content wi-custom-scroll treeNode"
								@on-check-change="checkChange('checkedRight', $refs.rightList, 'checkAll_right')">
						</Tree>
						<Tree ref="rightList_match"
								v-show="searchRightFlag"
								:data="dataRight_match"
								:show-checkbox="!readonly"
								class="ivu-transfer-list-content wi-custom-scroll treeNode"
								@on-check-change="checkChange('checkedRight_match', $refs.rightList_match, 'checkAll_right_match')">
						</Tree>
					</Row>
				</Row>
				<!-- 二次选择 -->
				<Row ref="second-select-wrapper" class="second-select-wrapper" v-if="config && config.secondSelect">
					<!-- 中间 -->
					<Row class="ivu-transfer-operation">
						<Button size="small" type="primary" :disabled="disableAdd_2th()" @click="add_2th">添加</Button>
						<Button size="small" type="ghost"  :disabled="disableRemove_2th()" @click="remove_2th">删除</Button>
					</Row>
					<!-- 二次已选 -->
					<Row class="ivu-transfer-list" >
						<Row class="ivu-transfer-list-header">
							<span class="ivu-transfer-list-header-title">
								<Checkbox v-show="!search_2th"
										v-model="checkAll_2th"
										@on-change="toggleAll($event, 'data_2th', 'checked_2th', $refs.list_2th, 'checkAll_2th')"
										:disabled="data_2th.length === 0">已选
								</Checkbox>
								<Checkbox v-show="search_2th"
										v-model="checkAll_2th_match"
										@on-change="toggleAll($event, 'data_2th_match', 'checked_2th_match', $refs.list_2th_match, 'checkAll_2th_match')"
										:disabled="data_2th.length === 0">已选
								</Checkbox>
							</span>
							<span class="ivu-transfer-list-header-count" v-show="!readonly">
								<span class="selected_count">已选</span>{{selected_2th.length}}
							</span>
						</Row>
						<Row class="search-wrapper">
							<Input ref="searchRight" v-model="keyword_2th" icon="ios-search" size="small" @on-change="searchChange($event, data_2th, 'data_2th_match')" clearable></Input>
						</Row>
						<Row class="ivu-transfer-list-body">
							<Tree ref="list_2th"
									v-show="!search_2th"
									:data="data_2th"
									class="ivu-transfer-list-content wi-custom-scroll treeNode"
									show-checkbox
									@on-check-change="checkChange('checked_2th', $refs.list_2th, 'checkAll_2th')">
							</Tree>
							<Tree ref="list_2th_match"
									v-show="search_2th"
									:data="data_2th_match"
									class="ivu-transfer-list-content wi-custom-scroll treeNode"
									show-checkbox
									@on-check-change="checkChange('checked_2th_match', $refs.list_2th_match, 'checkAll_2th_match')">
							</Tree>
						</Row>
					</Row>
				</Row>
			</Row>
		</Row>
	</Row>
</template>

<script>
	import axios from 'axios';

	const TransferComponent = {
		name: 'transfer-selector',
		props: ['data', 'config'],
		data() {
			const vm = this;
			return {
				readonly: vm.config && vm.config.readonly,
				title: vm.config && vm.config.title,
				watchFlag : vm,
				dataLeft: [],
				dataRight: [],
				data_2th: [],

				checkedLeft: [],
				checkedRight: [],
				checked_2th:[],

				data_raw: {},
				checkAll_left: false,
				checkAll_right: false,
				checkAll_2th:false,

				selected: [],
				selected_2th:[],

				data_type: vm.config && (vm.config.dataType
					?  vm.config.dataType
					: (vm.config.dataOptions && vm.config.dataOptions.length
						? vm.config.dataOptions[0].value
						: ''
					)),
				dataOptions: vm.config && vm.config.dataOptions,
				server: vm.config && vm.config.server,


				/* search */
				keyword_left: '',
				dataLeft_match: [],
				checkedLeft_match: '',
				checkAll_left_match: '',

				keyword_right: '',
				dataRight_match: [],
				checkedRight_match: '',
				checkAll_right_match: '',

				keyword_2th: '',
				data_2th_match: [],
				checked_2th_match: '',
				checkAll_2th_match: '',
			};
		},
		computed:{
			/* 展示左边搜索结果标志 */
			searchLeftFlag:function(){
				return this.keyword_left.trim().length >0;
			},
			/* 展示右边搜索结果标志 */
			searchRightFlag:function(){
				return this.keyword_right.trim().length >0;
			},
			search_2th:function(){
				return this.keyword_2th.trim().length >0;
			}
		},
		created() {
			/* 监听数据传入 */
			const vm = this,
				unWatch = vm.$watch('data', (newVal, oldVal) => {
					if((!oldVal || !oldVal.datas) && newVal && newVal.datas && vm.watchFlag){
						vm.data_raw = vm.data;
						vm._initialize();
					}
				}, {
					immediate: true
				});
		},
		mounted() {},
		methods: {
			/* 添加按钮的disabled状态 */
			disableAdd(){
				const vm = this;
				if(vm.keyword_left.trim().length === 0 && this.checkedLeft.length > 0){
					return false;
				}else if(vm.keyword_left.trim().length > 0 && vm.checkedLeft_match.length > 0){
					return false;
				}
				return true;
			},
			disableAdd_2th(){
				const vm = this;
				if(vm.keyword_right.trim().length === 0 && vm.checkedRight.length > 0){
					return false;
				}else if(vm.keyword_right.trim().length > 0 && vm.checkedRight_match.length > 0){
					return false;
				}
				return true;
			},
			disableRemove(){
				const vm = this;
				if(vm.keyword_right.trim().length === 0 && vm.checkedRight.length > 0){
					return false;
				}else if(vm.keyword_right.trim().length > 0 && vm.checkedRight_match.length > 0){
					return false;
				}
				return true;
			},
			disableRemove_2th(){
				const vm = this;
				if(vm.keyword_2th.trim().length === 0 && vm.checked_2th.length > 0){
					return false;
				}else if(vm.keyword_2th.trim().length > 0 && vm.checked_2th_match.length > 0){
					return false;
				}
				return true;
			},

			/**
			 * initialize.
			 * @param callBack
			 * @private
			 */
			_initialize(callBack) {
				const vm = this;
				let expand = true;
				this.data_raw.datas.map(item => {
					item.title = item.name;
					item.expand = expand;
					if (vm.config && null != vm.config.expandTo) {
						if (item.level > vm.config.expandTo) {
							item.expand = false;
						}
					}
				});
				vm.dataLeft = vm.nestData(
					vm.data_raw.datas,
					vm.data_raw.maxLevel
				);
				if(callBack) callBack();
			},
			/* 数据源改变 */
			dataTypeChange(type) {
				this.getRemoteData(type,()=>{
					this.$emit("change",this.getSelected());
				});
			},
			//获取远程数据并初始化
			getRemoteData(type,callBack) {
				//清数据
				this.dataLeft = [];
				this.dataRight = [];
				this.dataLeft_match = [];
				this.dataRight_match = [];
				this.selected = [];
				this.checkedRight = [];
				this.checkedLeft = [];
				this.checkAll_left = false;
				this.checkAll_right = false;
				this.keyword_left = "";
				this.keyword_right = "";
				//取数据
				axios
					.get(this.server + (null == type ? "" : type))
					.then(res => {
						if ("0" == res.data.ret.retCode) {
							this.data_raw = res.data.data;
							this._initialize(callBack);
						}
					});

			},
			//一维数组转嵌套结构
			nestData(data, levelMax) {
				let $data = JSON.parse(JSON.stringify(data));
				let data_pack = [];

				// 從下往上
				for (let level = levelMax; level > 0; level--) {
					//篩選出相應層級
					let indexs = [];
					let data_level = $data.filter((item, index) => {
						if (item.level == level) {
							indexs.push(index);
						}
						return item.level == level;
					});

					//組裝到上一級
					for (let i = 0; i < data_level.length; i++) {
						//篩選出父節點
						//filter 返回新的數組
						let parentIndex = null;
						let parentNode = $data.filter((item, index) => {
							if (item.id == data_level[i].parentId) {
								parentIndex = index;
							}
							return item.id == data_level[i].parentId;
						});
						if ($data[parentIndex] && !$data[parentIndex].children) {
							$data[parentIndex].children = [];
						}
						//組裝到父級
						if ($data[parentIndex]) {
							$data[parentIndex].children.push($data[indexs[i]]);
						}
					}
				}
				//取出第一層數據
				data_pack = $data.filter(item => {
					return item.level == 1;
				});

				return data_pack;
			},
			//checkbox change,params1:checkedData的变量键名；params2：树的组件
			checkChange(checkedDataKey,treeObject,checkAllKey){
				this[checkedDataKey] = treeObject.getCheckedNodes();
				if (0 == this[checkedDataKey].length) {
					this[checkAllKey] = false;
				}else{
					//
					let fullArr = this.treeToArr(treeObject.data);
					if(this[checkedDataKey].length < fullArr.length){
						this[checkAllKey] = false;
					}else{
						this[checkAllKey] = true;
					}
				}
			},
			//添加
			add() {
				//取出checkedNodes
				let nodeStr = "";
				if(!this.searchLeftFlag){
					nodeStr = JSON.stringify(this.$refs.leftList.getCheckedNodes());
				}else{
					nodeStr = JSON.stringify(this.$refs.leftList_match.getCheckedNodes());
				}

				let $checked = JSON.parse(nodeStr);
				let checked = JSON.parse(nodeStr);
				//清楚不需要属性
				for (let i = 0; i < checked.length; i++) {
					if (checked[i].hasOwnProperty("nodeKey")) {
						delete checked[i].nodeKey;
					}
					if (checked[i].hasOwnProperty("children")) {
						delete checked[i].children;
					}
					if (checked[i].hasOwnProperty("indeterminate")) {
						delete checked[i].indeterminate;
					}
					if (checked[i].hasOwnProperty("checked")) {
						delete checked[i].checked;
					}

					//添加父节点
					if (
						null != checked[i].parentId &&
						checked.filter(item => {
							return item.id == checked[i].parentId;
						}).length == 0
					) {
						let parentNode = this.data_raw.datas.filter(_item => {
							return _item.id == checked[i].parentId;
						});
						if (parentNode.length) {
							checked.push(parentNode[0]);
						}
					}
				}

				//递归删除左侧数据
				if(this.searchLeftFlag){
					this.removeFromTree(this.dataLeft_match, $checked);
					//删除search出来的节点，只能把有效节点删除
					this.dataLeft = this.removeFromTreeWhenNoChildren(this.dataLeft, $checked);
					//清左树
				}else{
					this.removeFromTree(this.dataLeft, $checked);
				}
				//添加到右侧树
				this.addToTree(this.dataRight, checked);
				if(this.searchRightFlag){
					//不应该这样添加，只能添加匹配的
					//this.addToTree(this.dataRight_match, checked);
					this.searchChange({target:{value:this.keyword_right}},this.dataRight,'dataRight_match');
				}

				//清楚“clearIndeterminate”状态
				if(!this.searchLeftFlag){
					this.clearIndeterminate(this.dataLeft);
				}else{
					this.clearIndeterminate(this.dataLeft_match);
				}

				//
				this.$nextTick(() => {
					//
					this.checkChange("checkedLeft",this.$refs.leftList,"checkAll_left");
					if(this.searchLeftFlag){
						this.checkChange("checkedLeft_match",this.$refs.leftList_match,"checkAll_left_match");
					}

					this.checkChange("checkedRight",this.$refs.rightList,"checkAll_right");
					if(this.searchRightFlag){
						this.checkChange("checkedRight_match",this.$refs.rightList_match,"checkAll_right_match");
					}
					//
					this.$emit("change",this.getSelected());
					//这样才能触发更新
					this.dataLeft = JSON.parse(JSON.stringify(this.dataLeft));
					if(this.searchLeftFlag){
						this.dataLeft_match = JSON.parse(JSON.stringify(this.dataLeft_match));
					}

					this.dataRight = JSON.parse(JSON.stringify(this.dataRight));
					if(this.searchRightFlag){
						this.dataRight_match = JSON.parse(JSON.stringify(this.dataRight_match));
					}
					this.$nextTick();
				});
			},
			//添加
			add_2th() {
				//取出checkedNodes
				let nodeStr = "";
				if(!this.searchRightFlag){
					nodeStr = JSON.stringify(this.$refs.rightList.getCheckedNodes());
				}else{
					nodeStr = JSON.stringify(this.$refs.rightList_match.getCheckedNodes());
				}

				let $checked = JSON.parse(nodeStr);
				let checked = JSON.parse(nodeStr);
				//清楚不需要属性
				for (let i = 0; i < checked.length; i++) {
					if (checked[i].hasOwnProperty("nodeKey")) {
						delete checked[i].nodeKey;
					}
					if (checked[i].hasOwnProperty("children")) {
						delete checked[i].children;
					}
					if (checked[i].hasOwnProperty("indeterminate")) {
						delete checked[i].indeterminate;
					}
					if (checked[i].hasOwnProperty("checked")) {
						delete checked[i].checked;
					}

					//添加父节点
					if (
						null != checked[i].parentId &&
						checked.filter(item => {
							return item.id == checked[i].parentId;
						}).length == 0
					) {
						let parentNode = this.data_raw.datas.filter(_item => {
							return _item.id == checked[i].parentId;
						});
						if (parentNode.length) {
							checked.push(parentNode[0]);
						}
					}
				}

				//递归删除左侧数据
				if(this.searchRightFlag){
					this.removeFromTree(this.dataRight_match, $checked);
					//删除search出来的节点，只能把有效节点删除
					this.dataRight = this.removeFromTreeWhenNoChildren(this.dataRight, $checked);
					//清左树
				}else{
					this.removeFromTree(this.dataRight, $checked);
				}
				//添加到右侧树
				this.addToTree(this.data_2th, checked);
				if(this.search_2th){
					//不应该这样添加，只能添加匹配的
					//this.addToTree(this.dataRight_match, checked);
					this.searchChange({target:{value:this.keyword_2th}},this.data_2th,'data_2th_match');
				}

				//清楚“clearIndeterminate”状态
				if(!this.searchRightFlag){
					this.clearIndeterminate(this.dataRight);
				}else{
					this.clearIndeterminate(this.dataRight_match);
				}

				//
				this.$nextTick(() => {
					//
					this.checkChange("checkedRight",this.$refs.rightList,"checkAll_right");
					if(this.searchRightFlag){
						this.checkChange("checkedRight_match",this.$refs.rightList_match,"checkAll_right_match");
					}

					this.checkChange("checked_2th",this.$refs.list_2th,"checkAll_2th");
					if(this.search_2th){
						this.checkChange("checked_2th_match",this.$refs.list_2th_match,"checkAll_2th_match");
					}
					//
					this.$emit("change",this.getSelected());
					//这样才能触发更新
					this.dataRight = JSON.parse(JSON.stringify(this.dataRight));
					if(this.searchRightFlag){
						this.dataRight_match = JSON.parse(JSON.stringify(this.dataRight_match));
					}

					this.data_2th = JSON.parse(JSON.stringify(this.data_2th));
					if(this.search_2th){
						this.data_2th_match = JSON.parse(JSON.stringify(this.data_2th_match));
					}
					this.$nextTick();
				});
			},
			//删除
			remove() {
				//取出checkedNodes
				let nodeStr = "";
				if(!this.searchRightFlag){
					nodeStr = JSON.stringify(this.$refs.rightList.getCheckedNodes());
				}else{
					nodeStr = JSON.stringify(this.$refs.rightList_match.getCheckedNodes());
				}
				let $checked = JSON.parse(nodeStr);
				let checked = JSON.parse(nodeStr);
				//清除不需要的属性
				for (let i = 0; i < checked.length; i++) {
					if (checked[i].hasOwnProperty("nodeKey")) {
						delete checked[i].nodeKey;
					}
					if (checked[i].hasOwnProperty("children")) {
						delete checked[i].children;
					}
					if (checked[i].hasOwnProperty("indeterminate")) {
						delete checked[i].indeterminate;
					}
					if (checked[i].hasOwnProperty("checked")) {
						delete checked[i].checked;
					}

					//添加父节点
					if (
						null != checked[i].parentId &&
						checked.filter(item => {
							return item.id == checked[i].parentId;
						}).length == 0
					) {
						let parentNode = this.data_raw.datas.filter(_item => {
							return _item.id == checked[i].parentId;
						});
						if (parentNode.length) {
							checked.push(parentNode[0]);
						}
					}
				}

				//递归删除右侧数据
				if(this.searchRightFlag){
					this.removeFromTree(this.dataRight_match, $checked);
					//删除search出来的节点，只能把有效节点删除
					this.dataRight = this.removeFromTreeWhenNoChildren(this.dataRight, $checked);
					//清左树
				}else{
					this.removeFromTree(this.dataRight, $checked);
				}

				this.addToTree(this.dataLeft, checked);
				if(this.searchLeftFlag){
					this.searchChange({target:{value:this.keyword_left}},this.dataLeft,"dataLeft_match");
				}

				//清楚“clearIndeterminate”状态
				if(!this.searchRightFlag){
					this.clearIndeterminate(this.dataRight);
				}else{
					this.clearIndeterminate(this.dataRight_match);
				}

				this.$nextTick(() => {
					this.$refs["right-wrapper"]
						.querySelectorAll(".ivu-checkbox-indeterminate")
						.forEach(node => {
							node.classList.remove("ivu-checkbox-indeterminate");
						});
				});

				//
				this.$nextTick(() => {
					this.checkChange("checkedLeft",this.$refs.leftList,"checkAll_left");
					if(this.searchLeftFlag){
						this.checkChange("checkedLeft_match",this.$refs.leftList_match,"checkAll_left_match");
					}

					this.checkChange("checkedRight",this.$refs.rightList,"checkAll_right");
					if(this.searchRightFlag){
						this.checkChange("checkedRight_match",this.$refs.rightList_match,"checkAll_right_match");
					}

					//
					this.$emit("change",this.getSelected());
					//  这样才能触发更新
					this.dataLeft = JSON.parse(JSON.stringify(this.dataLeft));
					if(this.searchLeftFlag){
						this.dataLeft_match = JSON.parse(JSON.stringify(this.dataLeft_match));
					}

					this.dataRight = JSON.parse(JSON.stringify(this.dataRight));
					if(this.searchRightFlag){
						this.dataRight_match = JSON.parse(JSON.stringify(this.dataRight_match));
					}
					this.$nextTick();
				});
			},
			remove_2th(){
				//取出checkedNodes
				let nodeStr = "";
				if(!this.search_2th){
					nodeStr = JSON.stringify(this.$refs.list_2th.getCheckedNodes());
				}else{
					nodeStr = JSON.stringify(this.$refs.list_2th_match.getCheckedNodes());
				}
				let $checked = JSON.parse(nodeStr);
				let checked = JSON.parse(nodeStr);
				//清除不需要的属性
				for (let i = 0; i < checked.length; i++) {
					if (checked[i].hasOwnProperty("nodeKey")) {
						delete checked[i].nodeKey;
					}
					if (checked[i].hasOwnProperty("children")) {
						delete checked[i].children;
					}
					if (checked[i].hasOwnProperty("indeterminate")) {
						delete checked[i].indeterminate;
					}
					if (checked[i].hasOwnProperty("checked")) {
						delete checked[i].checked;
					}

					//添加父节点
					if (
						null != checked[i].parentId &&
						checked.filter(item => {
							return item.id == checked[i].parentId;
						}).length == 0
					) {
						let parentNode = this.data_raw.datas.filter(_item => {
							return _item.id == checked[i].parentId;
						});
						if (parentNode.length) {
							checked.push(parentNode[0]);
						}
					}
				}

				//递归删除右侧数据
				if(this.search_2th){
					this.removeFromTree(this.data_2th_match, $checked);
					//删除search出来的节点，只能把有效节点删除
					this.data_2th = this.removeFromTreeWhenNoChildren(this.data_2th, $checked);
					//清左树
				}else{
					this.removeFromTree(this.data_2th, $checked);
				}

				this.addToTree(this.dataRight, checked);
				if(this.searchRightFlag){
					this.searchChange({target:{value:this.keyword_right}},this.dataRight,"dataRight_match");
				}

				//清楚“clearIndeterminate”状态
				if(!this.search_2th){
					this.clearIndeterminate(this.data_2th);
				}else{
					this.clearIndeterminate(this.data_2th_match);
				}

				// this.$nextTick(() => {
				//   this.$refs["second-select-wrapper"]
				//     .querySelectorAll(".ivu-checkbox-indeterminate")
				//     .forEach(node => {
				//       node.classList.remove("ivu-checkbox-indeterminate");
				//     });
				// });

				//
				this.$nextTick(() => {
					this.checkChange("checkedRight",this.$refs.rightList,"checkAll_right");
					if(this.searchRightFlag){
						this.checkChange("checkedRight_match",this.$refs.rightList_match,"checkAll_right_match");
					}

					this.checkChange("checked_2th",this.$refs.list_2th,"checkAll_2th");
					if(this.search_2th){
						this.checkChange("checked_2th_match",this.$refs.list_2th_match,"checkAll_2th_match");
					}

					//
					this.$emit("change",this.getSelected());
					//  这样才能触发更新
					this.dataRight = JSON.parse(JSON.stringify(this.dataRight));
					if(this.searchRightFlag){
						this.dataRight_match = JSON.parse(JSON.stringify(this.dataRight_match));
					}

					this.data_2th = JSON.parse(JSON.stringify(this.data_2th));
					if(this.search_2th){
						this.data_2th_match = JSON.parse(JSON.stringify(this.data_2th_match));
					}
					this.$nextTick();
				});
			},
			//从树上摘掉
			removeFromTree(target, removesArr) {
				for (let i = 0; i < target.length; i++) {
					if (
						removesArr.filter(item => {
							return target[i].id == item.id;
						}).length
					) {
						target.splice(i, 1);
						i--;
					} else if (target[i].children) {
						this.removeFromTree(target[i].children, removesArr);
					}
				}
			},
			removeFromTreeWhenNoChildren(target, removesArr){
				//转一维数组
				let _targetArr = this.treeToArr(target,false);
				//sort removesArr,从下到上
				removesArr.sort((a, b) => {
					return Number(b.level) - Number(a.level);
				});

				//遍历removesArr，
				for(let i=0;i<removesArr.length;i++){
					for(let j=0;j<_targetArr.length;j++){
						if(_targetArr[j].id == removesArr[i].id){
							let children = _targetArr.filter(item=>{
								return item.parentId == _targetArr[j].id;
							});
							if(children.length == 0){
								_targetArr.splice(j,1);
								break;
							}
						}
					}
				}

				return this.nestData(_targetArr,this.data_raw.maxLevel);
			},
			//装树
			addToTree(target, addsArr, sortFlag = true) {
				//排序
				if (sortFlag) {
					addsArr = addsArr.sort((a, b) => {
						return Number(a.level) - Number(b.level);
					});
				}

				//无数据时
				if (target.length == 0) {
					let nestData = this.nestData(addsArr, this.data_raw.maxLevel);
					target.splice(0, 0, ...nestData);
				} else {
					//先装第一层
					let otherList_level1_ids = target.map(item => {
						return item.id;
					});
					for (let i = 0; i < addsArr.length; i++) {
						if ("1" == addsArr[i].level) {
							if (otherList_level1_ids.indexOf(addsArr[i].id) == -1) {
								let treeFragment_el_ids = [];
								let treeFragment_els = this.getTreelineNodes(addsArr[i], addsArr);

								treeFragment_els.map(item => {
									treeFragment_el_ids.push(item.id);
								});

								target.push(
									this.nestData(treeFragment_els, this.data_raw.maxLevel)[0]
								);

								// 删除待添加数组
								for (let j = 0; j < addsArr.length; j++) {
									if (treeFragment_el_ids.indexOf(addsArr[j].id) !== -1) {
										addsArr.splice(j, 1);
										j--;
									}
								}
								i--;
							}
						} else {
							break;
						}
					}
					//遍历，添加
					this.loopTreeAndAdd(target, addsArr);
				}
			},
			//获取子节点及自身节点
			getTreelineNodes(item, arr) {
				let nodes = [];
				let parentNode_now = [item.id];

				if (this.data_raw.maxLevel > item.level) {
					for (
						let level = Number(item.level) + 1;
						level <= this.data_raw.maxLevel;
						level++
					) {
						let filter = arr.filter(_item => {
							return parentNode_now.indexOf(_item.parentId) !== -1;
						});
						parentNode_now = [];
						for (let i = 0; i < filter.length; i++) {
							parentNode_now.push(filter[i].id);
							if (nodes.indexOf(filter[i].id) === -1) {
								nodes.push(filter[i]);
							}
						}
						if (filter.length === 0) {
							break;
						}
					}
				}
				nodes.unshift(item);
				return nodes;
			},
			//遍历目标树（level1节点已经提前装上），添加加点
			loopTreeAndAdd(treeData, adds) {
				for (let i = 0; i < treeData.length; i++) {
					//取出目标节点，现有子节点
					let id_exist = [];
					if (treeData[i].children && treeData[i].children.length) {
						id_exist = treeData[i].children.map(item => {
							return item.id;
						});
					}
					//取到待添加节点中，该目标节点的子节点
					let filters = adds.filter(item => {
						return item.parentId == treeData[i].id;
					});

					if (filters.length) {
						if (null == treeData[i].children) {
							treeData[i].children = [];
						}
						filters.forEach(el => {
							//已存在不添加
							if (id_exist.indexOf(el.id) == -1) {
								//el.expand = true;
								treeData[i].children.push(el);
							}
						});
					}
					if (treeData[i].children && treeData[i].children.length) {
						this.loopTreeAndAdd(treeData[i].children, adds);
					}
				}
			},
			//清掉半选状态
			clearIndeterminate(treeData) {
				for (let i = 0; i < treeData.length; i++) {
					treeData[i].indeterminate = false;
					if (treeData[i].children && treeData[i].children.length) {
						this.clearIndeterminate(treeData[i].children);
					}
				}
			},
			//全选checkbox切换
			toggleAll(value,dataToToggleKey,checkedDataKey,treeObject,checkAllKey){
				if (value) {
					this.checkAll(this[dataToToggleKey]);
					setTimeout(() => {
						this[dataToToggleKey] = JSON.parse(JSON.stringify(this[dataToToggleKey]));
						//this.checkChange("checkedLeft",this.$refs.leftList);
						this.checkChange(checkedDataKey,treeObject,checkAllKey);
					}, 100);
				} else {
					this.uncheckAll(this[dataToToggleKey]);
					setTimeout(() => {
						this[dataToToggleKey] = JSON.parse(JSON.stringify(this[dataToToggleKey]));
						this.checkChange(checkedDataKey,treeObject,checkAllKey);
					}, 100);
				}
			},
			//全选
			checkAll(treeData) {
				for (let i = 0; i < treeData.length; i++) {
					treeData[i].checked = true;
					treeData[i].indeterminate = false;
					if (treeData[i].children && treeData[i].children.length) {
						this.checkAll(treeData[i].children);
					}
				}
			},
			//全不选
			uncheckAll(treeData) {
				for (let i = 0; i < treeData.length; i++) {
					treeData[i].checked = false;
					treeData[i].indeterminate = false;
					if (treeData[i].children && treeData[i].children.length) {
						this.uncheckAll(treeData[i].children);
					}
				}
			},
			//获取树的计数已选节点id
			getTreeNodes(treeData) {
				let _treeData = JSON.parse(JSON.stringify(treeData));

				let nodesArr = [];
				for (let i = 0; i < _treeData.length; i++) {
					nodesArr.push(_treeData[i]);
					if (_treeData[i].children && _treeData[i].children.length) {
						_treeData.splice(_treeData.length, 0, ..._treeData[i].children);
					}
				}

				//排序
				nodesArr = nodesArr.sort((a, b) => {
					return Number(b.level) - Number(a.level);
				});

				for (let i = 0; i < nodesArr.length; i++) {
					if (null != nodesArr[i].parentId) {
						let allSibs = this.data_raw.datas.filter(item => {
							return item.parentId == nodesArr[i].parentId;
						});
						let nowSibs = nodesArr.filter(item => {
							return item.parentId == nodesArr[i].parentId;
						});

						//如果不全，把父级删除
						if (allSibs.length > nowSibs.length) {
							let parentIds = [];

							let parent_now = nodesArr.filter(item => {
								return item.id == nodesArr[i].parentId;
							})[0];

							while (null != parent_now) {
								parentIds.push(parent_now.id);

								if (parent_now.parentId) {
									let nextParent = this.data_raw.datas.filter(item => {
										return item.id == parent_now.parentId;
									});
									if (nextParent[0]) {
										parent_now = nextParent[0];
									} else {
										break;
									}
								} else {
									break;
								}
							}
							for (let j = 0; j < nodesArr.length; j++) {
								if (parentIds.indexOf(nodesArr[j].id) != -1) {
									nodesArr.splice(j, 1);
									j--;
								}
							}
						} else {
							//全则把自己及sibs删除
							let nowSibs = nodesArr.filter(item => {
								return item.parentId == nodesArr[i].parentId;
							});
							let nowSib_ids = nowSibs.map(item => {
								return item.id;
							});

							for (let j = 0; j < nodesArr.length; j++) {
								if (nowSib_ids.indexOf(nodesArr[j].id) != -1) {
									nodesArr.splice(j, 1);
									j--;
								}
							}
							i--;
						}
					}
				}

				let selectedIds = nodesArr.map(item => {
					return item.id;
				});
				return {
					ids:selectedIds,
					nodes:nodesArr
				};
			},
			//设置已选
			_setSelected(ids) {
				//还要设置dataType
				let data_raw = JSON.parse(JSON.stringify(this.data_raw.datas));

				if (ids && ids.length) {
					let rights = [];
					let lefts = [];

					data_raw.map(item => {
						if (ids.indexOf(item.id) == -1) {
							lefts.push(item);
						} else {
							rights.push(item);
						}
					});

					//左边去除没有父级的子节点,
					for (let i = 0; i < lefts.length; i++) {
						if (
							lefts[i].parentId &&
							lefts.filter(item => {
								return item.id == lefts[i].parentId;
							}) == 0
						) {
							lefts.splice(i, 1);
							i--;
						}
					}
					//左边去除没有子节点但元数据中存在子节点的节点
					lefts.sort((a, b) => {
						return Number(b.level) - Number(a.level);
					});
					for (let i = 0; i < lefts.length; i++) {
						if (lefts.filter(item => {return item.parentId == lefts[i].id;}) == 0 && this.data_raw.datas.filter(item => {return item.parentId == lefts[i].id;}) != 0) {
							lefts.splice(i, 1);
							i--;
						}
					}

					this.dataLeft = this.nestData(lefts, this.data_raw.maxLevel);

					//右边补全子节点的父节点,补全父节点的子节点
					for (let i = 0; i < rights.length; i++) {
						if (rights[i].level != 1) {
							if (
								rights.filter(item => {
									return item.id == rights[i].parentId;
								}).length == 0
							) {
								let parent = data_raw.filter(_item => {
									return _item.id == rights[i].parentId;
								});
								if (parent.length) {
									rights.push(parent[0]);
								}
							}
						}
						if (
							rights.filter(item => {
								return item.parentId == rights[i].id;
							}).length == 0
						) {
							let sons = data_raw.filter(item => {
								return item.parentId == rights[i].id;
							});
							if (sons.length) {
								rights.splice(rights.length, 0, ...sons);
							}
						}
					}
					this.dataRight = this.nestData(rights, this.data_raw.maxLevel);
				}
			},
			//reset相关数据
			clearData(){
				this.dataLeft=[];
				this.dataRight= [];
				this.checkedLeft= [];
				this.checkedRight= [];
				this.data_raw= {};
				this.checkAll_left= false;
				this.checkAll_right= false;
				this.selected= [];

				this.data_2th = [];
				this.checked_2th = [];
				this.checkAll_2th = false;
				this.selected_2th = [];
			},
			//树结构转一维数组
			treeToArr(treeData,clearAttrs = true,reserves){
				let _treeData = JSON.parse(JSON.stringify(treeData));
				for(let i=0;i<_treeData.length;i++){
					if (_treeData[i].hasOwnProperty("indeterminate")) {
						delete _treeData[i].indeterminate;
					}
					if(clearAttrs){
						if (_treeData[i].hasOwnProperty("nodeKey")) {
							delete _treeData[i].nodeKey;
						}
						if (_treeData[i].hasOwnProperty("checked")) {
							delete _treeData[i].checked;
						}
					}

					if(_treeData[i].children && _treeData[i].children.length){
						_treeData.splice(_treeData.length,0,..._treeData[i].children);
						delete _treeData[i].children;
					}
				}
				return _treeData;
			},



			//对外，返回已选
			getSelected() {
				let nodeInfos = {};
				if(this.config && this.config.secondSelect){
					nodeInfos = this.getTreeNodes(this.data_2th);
					this.selected_2th = nodeInfos.ids;
				}else{
					nodeInfos = this.getTreeNodes(this.dataRight);
					this.selected = nodeInfos.ids;
				}



				let data_back = {
					type:this.data_type,
					data:nodeInfos.ids,
					nodes:nodeInfos.nodes
				}
				return data_back;
			},
			//对外,初始化,不需要外部传data,会根据配置url请求数据,1.有dataOptions的,根据配置的dataType请求,默认第一个;2.没有dataOptions的,直接请求配置url
			init(){
				//清数据据
				this.clearData();
				this.watchFlag = false;
				if(this.server){
					if(this.data_type){
						this.getRemoteData(this.data_type);
					}else if(this.dataOptions && this.dataOptions.length){
						this.getRemoteData(this.dataOptions[0].value);
					}else{
						this.getRemoteData();
					}
				}
			},
			//对外,带已选的初始化,1.根据传入的type请求;
			initWithSelected(data){
				//id转字符串
				if(data.data && data.data.length){
					data.data.forEach((item,index) =>{
						data.data[index] = data.data[index].toString();
					});
				}
				//先初始化，
				//清数据据
				this.clearData();
				this.watchFlag = false;
				this.data_type = data.type;
				this.getRemoteData(data.type,()=>{
					this._setSelected(data.data);
					this.getSelected();
				});
			},
			//对外，设置已选
			setSelected(data){
				this.data_type = data.type;
				this._setSelected(data.data);
				this.getSelected();
			},

			//search
			//params1:树data
			searchChange($event,dataTree,dataMatchKey){
				let oldVal = $event.target.value.trim();
				if("" == oldVal){
					//还原成非搜索状态
				}else{
					setTimeout(()=>{
						let nowVal = $event.target.value.trim();
						if(oldVal == nowVal && nowVal!=""){
							//获取左侧数据数组
							let data_arr = this.treeToArr(dataTree);
							data_arr.forEach(item=>{
								item.expand = false;
							});
							//获取匹配
							let matches = data_arr.filter(item=>{
								return item.title.search(new RegExp(nowVal,"i")) !=-1;
							});
							let matchFullfil = JSON.parse(JSON.stringify(matches));

							//没有父节点，则补父节点，   父节点为展开状态
							for(let i=0;i<matchFullfil.length;i++){
								if(null!=matchFullfil[i].parentId){
									let parent = matchFullfil.filter((item,index)=>{
										if(item.id == matchFullfil[i].parentId){
											matchFullfil[index].expand =true;
										}
										return item.id == matchFullfil[i].parentId;
									});

									if(parent.length == 0){
										let parent = data_arr.filter(item=>{
											return item.id == matchFullfil[i].parentId;
										});
										if(parent.length){
											parent[0].expand = true;
											matchFullfil.push(parent[0]);
										}
									}
								}
							}

							//补充子节点，子节点expand是false；
							for(let i=0;i<matches.length;i++){
								let nowChildren = matches.filter(item=>{
									return item.parentId == matches[i].id;
								});
								let allChildren = data_arr.filter(item=>{
									return item.parentId == matches[i].id;
								});

								if(nowChildren.length<allChildren.length){
									let ids = nowChildren.map(item=>{
										return item.id;
									});
									let appends = allChildren.filter(item=>{
										return ids.indexOf(item.id) == -1;
									});

									if(appends.length){
										matchFullfil.splice(matchFullfil.length,0,...appends);
										matches.splice(matchFullfil.length,0,...appends);
									}
								}
							}
							this[dataMatchKey] = this.nestData(matchFullfil,this.data_raw.maxLevel);
						}
					},200);
				}
			}
		}
	};
	export default TransferComponent;
</script>